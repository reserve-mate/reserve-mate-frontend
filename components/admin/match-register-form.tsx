"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { matchService } from "@/lib/services/matchService"
import { FacilityManager } from "@/lib/services/userService"
import { SportType } from "@/lib/enum/matchEnum"
import { CourtName, FacilityManagerName, FacilityNames } from "@/lib/types/facilityTypes"
import { facilityService } from "@/lib/services/facilityService"
import { MatchRegist } from "@/lib/types/matchTypes"

const sportTypes = [
  { value: "SOCCER", label: "축구" },
  { value: "FUTSAL", label: "풋살" },
  { value: "BASKETBALL", label: "농구" },
  { value: "TENNIS", label: "테니스" },
  { value: "BADMINTON", label: "배드민턴" },
  { value: "BASEBALL", label: "야구" },
]

const skillLevels = [
  { value: "beginner", label: "입문자" },
  { value: "intermediate", label: "중급자" },
  { value: "advanced", label: "상급자" },
  { value: "all", label: "모든 레벨" },
]

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : `${i}`
  return { value: `${hour}:00`, label: `${hour}:00` }
})

// 시설 타입 정의
type Facility = {
  id: string;
  name: string;
  address: string;
  sportType: string;
  openingHours: string;
  courts?: Court[];
}

// 코트 타입 정의
type Court = {
  id: string;
  name: string;
  type: string;
  width: string;
  height: string;
  isActive: boolean;
}

// 예약 현황 타입 정의
type Reservation = {
  facilityId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
}

// 더미 시설 데이터
const dummyFacilities: Facility[] = [
  {
    id: "1",
    name: "서울 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: "tennis",
    openingHours: "09:00-22:00",
    courts: [
      {
        id: "1-1",
        name: "센터 코트",
        type: "hardcourt",
        width: "20",
        height: "10",
        isActive: true
      },
      {
        id: "1-2",
        name: "A코트",
        type: "clay",
        width: "18",
        height: "9",
        isActive: true
      },
      {
        id: "1-3",
        name: "B코트",
        type: "hardcourt",
        width: "20",
        height: "10",
        isActive: false
      }
    ]
  },
  {
    id: "2",
    name: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "futsal",
    openingHours: "08:00-23:00",
    courts: [
      {
        id: "2-1",
        name: "메인 풋살장",
        type: "artificial",
        width: "25",
        height: "15",
        isActive: true
      },
      {
        id: "2-2", 
        name: "보조 풋살장",
        type: "artificial",
        width: "20",
        height: "12",
        isActive: true
      }
    ]
  },
  {
    id: "3",
    name: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "basketball",
    openingHours: "10:00-20:00",
    courts: [
      {
        id: "3-1",
        name: "실내 코트",
        type: "indoor",
        width: "28",
        height: "15",
        isActive: true
      }
    ]
  },
  {
    id: "4",
    name: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "badminton",
    openingHours: "08:00-22:00",
    courts: [
      {
        id: "4-1",
        name: "코트 A",
        type: "indoor",
        width: "13.4",
        height: "6.1",
        isActive: true
      },
      {
        id: "4-2",
        name: "코트 B",
        type: "indoor",
        width: "13.4",
        height: "6.1",
        isActive: true
      },
      {
        id: "4-3",
        name: "코트 C",
        type: "indoor",
        width: "13.4",
        height: "6.1",
        isActive: true
      }
    ]
  }
]

// 더미 예약 데이터
const dummyReservations: Reservation[] = [
  {
    facilityId: "1",
    courtId: "1-1",
    date: "2025-03-28",
    startTime: "10:00",
    endTime: "12:00"
  },
  {
    facilityId: "1",
    courtId: "1-2",
    date: "2025-03-28",
    startTime: "16:00",
    endTime: "18:00"
  },
  {
    facilityId: "2",
    courtId: "2-1",
    date: "2025-03-29",
    startTime: "18:00",
    endTime: "20:00"
  }
]

type RegisterMatchFormProps = {
  onComplete: (matchData: any) => void;
}

export default function RegisterMatchForm({ onComplete }: RegisterMatchFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  const [facilities, setFacilities] = useState<Facility[]>([])
  // 시설 이름 조회
  const [facilityNames, setFacilityNames] = useState<FacilityNames[]>([]);
  const [selectFacilityName, setSelectFacilityName] = useState<FacilityNames | null>(null);

  // 코트 이름 조회
  const [courtNames, setCourtNames] = useState<CourtName[]>([]);

  // 시설 매니저 이름 조회
  const [managerNames, setManagerNames] = useState<FacilityManagerName[]>([]);

  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ value: string, label: string }[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [availableCourts, setAvailableCourts] = useState<Court[]>([])
  const [facilityManagers, setFacilityManagers] = useState<FacilityManager[]>([])
  const [loadingManagers, setLoadingManagers] = useState(false)
  const [matchData, setMatchData] = useState({
    title: "",
    sportType: "",
    facilityId: "",
    facilityName: "",
    address: "",
    matchDate: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    fee: "",
    description: "",
    courtId: "",
    courtName: "",
    managerId: ""
  })
  
  // 시설 목록 로드
  useEffect(() => {
    // 실제로는 API에서 시설 목록을 가져옴
    // 여기서는 더미 데이터 사용
    setFacilities(dummyFacilities)
    setReservations(dummyReservations)
  }, [])
  
  // 스포츠 타입에 따라 시설 필터링
  useEffect(() => {
    if (matchData.sportType) {
      const filtered = facilities.filter(facility => 
        facility.sportType === matchData.sportType || matchData.sportType === 'other'
      )
      setFilteredFacilities(filtered)
    } else {
      setFilteredFacilities([])
    }
    
    // 스포츠 타입이 변경되면 시설 선택 초기화
    setMatchData(prev => ({
      ...prev,
      facilityId: "",
      facilityName: "",
      courtId: "",
      courtName: "",
      managerId: ""
    }))
    //setSelectedFacility(null)
    setSelectFacilityName(null);
    //setAvailableCourts([])
    setCourtNames([]);
    //setFacilityManagers([])
    setManagerNames([])
  }, [matchData.sportType, facilityNames])
  
  // 시설 선택에 따라 코트 필터링 및 시설 정보 업데이트
  useEffect(() => {
    if (matchData.facilityId) {
      const facility = facilityNames.find(f => f.facilityId === parseInt(matchData.facilityId))
      setSelectFacilityName(facility || null);
      
      if (facility && courtNames) {
        fetchGetCourts(facility.facilityId);
        // const activeCourts = courtNames.filter(court => court.isActive)
        // setAvailableCourts(activeCourts)
      } else {
        setCourtNames([]);
      }
      
      // 시설 주소 자동 설정
      if (facility) {
        setMatchData(prev => ({
          ...prev,
          facilityName: facility.facilityName,
          address: facility.address
        }))
        
        // 시설 관리자 목록 조회
        //loadFacilityManagers(parseInt(facility.id))
        fetchGetFacilityManger(facility.facilityId);
      }
    } else {
      setSelectFacilityName(null)
      setCourtNames([])
      setManagerNames([])
    }
    
    // 시설이 변경되면 코트 선택 초기화
    setMatchData(prev => ({
      ...prev,
      courtId: "",
      courtName: "",
      managerId: ""
    }))
  }, [matchData.facilityId, facilityNames])
  
  // 매치 날짜 선택 시 가능한 시간대 업데이트
  useEffect(() => {
    if (date && selectFacilityName) {
      updateAvailableTimeSlots(format(date, 'yyyy-MM-dd'))
    }
  }, [date, selectFacilityName, reservations])
  
  // 사용 가능 시간대 계산
  const updateAvailableTimeSlots = (selectedDate: string) => {
    if (!selectFacilityName) return
    
    // 운영 시간 파싱
    //const [openTime, closeTime] = selectedFacility.openingHours.split('-')
    const openHour = parseInt(selectFacilityName.startTime.split(':')[0]);
    console.log(openHour);
    let closeHour = parseInt(selectFacilityName.endTime.split(':')[0]);
    if(closeHour === 0) {
      closeHour = 24;
    }
    
    // 운영 시간 내 시간대 생성
    const operatingTimeSlots = Array.from(
      { length: closeHour - openHour + 1 },
      (_, i) => {
        const hour = openHour + i
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`
        return { value: `${formattedHour}:00`, label: `${formattedHour}:00` }
      }
    )

    setAvailableTimeSlots(operatingTimeSlots)
  }

  // 입력값 변경 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setMatchData(prev => ({ ...prev, [name]: value }))
  }

  // 스포츠 종목별 시설 조회
  const fetchGetFacilities = async (sportType: string) => {

    try{
      const facilityNames: FacilityNames[] = await facilityService.getMatchFacilityNames(sportType);
      setFacilityNames(facilityNames);
    }catch(error: any){
      console.log(error);
      if(!error) {
        window.location.href = "/login";
        return;
      }
      toast({
        title: "시설 조회 실패",
        description: error instanceof Error ? error.message : "시설 조회 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
    
  }

  // 스포츠 종목 변경 처리
  const handleSportChange = (value: string) => {
    setMatchData(prev => ({...prev, ["sportType"]: value}));
    fetchGetFacilities(value);
  }

  // 코트 조회
  const fetchGetCourts = async (facilityId: number) => {
    try{
      const courts: CourtName[] = await facilityService.getMatchCourtNames(facilityId);
      setCourtNames(courts)
    }catch(error: any) {
      if(!error) {
        window.location.href = "/login";
        return;
      }
      toast({
        title: "코트 조회 실패",
        description: error instanceof Error ? error.message : "시설 조회 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
    
  }

  // 시설 관리자 조회
  const fetchGetFacilityManger = async (facilityId: number) => {
    try {
      const facilityMangers: FacilityManagerName[] = await facilityService.getFacilityMangerNames(facilityId);
      setManagerNames(facilityMangers);
    }catch(error: any) {
      if(!error) {
        window.location.href = "/login";
        return;
      }
      toast({
        title: "매니저저 조회 실패",
        description: error instanceof Error ? error.message : "매니저 조회 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  }

  // 시설 변경 처리
  const handleFacilityChange = (value: string) => {
    setMatchData(prev => ({...prev, ["facilityId"]: value}));

    if(facilityNames.length > 0) {
      const facilityName = facilityNames.find(facility => value === String(facility.facilityId));

      if(facilityName) {
        setSelectFacilityName(facilityName);
        fetchGetCourts(facilityName.facilityId);
        fetchGetFacilityManger(facilityName.facilityId);
      }
      
    }
  }
  
  // 셀렉트 변경 처리
  const handleSelectChange = (name: string, value: string) => {
    setMatchData(prev => ({ ...prev, [name]: value }))
    
    // 코트 선택 시 코트명 자동 설정
    if (name === 'courtId' && value) {
      const court = availableCourts.find(c => c.id === value)
      if (court) {
        setMatchData(prev => ({ ...prev, courtName: court.name }))
      }
    }
  }
  
  // 체크박스 변경 처리
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMatchData(prev => ({ ...prev, [name]: checked }))
  }

  // 매치 등록 api
  const fetchPostMatchRegist = async (params: MatchRegist) => {
    try {
      await matchService.registMatch(params);

      toast({
        title: "매치 등록 완료",
        description: "매치가 성공적으로 등록되었습니다."
      });

      // 매치 등록 후 데이터 초기화
      setMatchData(prev => ({
        ...prev,
        title: "",
        sportType: "",
        facilityId: "",
        facilityName: "",
        address: "",
        matchDate: "",
        startTime: "",
        endTime: "",
        maxParticipants: "",
        fee: "",
        description: "",
        courtId: "",
        courtName: "",
        managerId: ""
      }))
      
    } catch (error: any) {
      toast({
        title: "매치 등록 실패",
        description: error.message,
        variant: "destructive"
      })
    }
  }
  
  // 매치 등록 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 필수 필드 체크
      if (!matchData.title || !matchData.sportType || !matchData.facilityId || 
          !matchData.courtId || !matchData.matchDate || !matchData.startTime || 
          !matchData.endTime || !matchData.maxParticipants || !matchData.fee) {
        throw new Error("필수 정보를 모두 입력해주세요.")
      }
      
      // 시간 유효성 체크
      const startTime = parseInt(matchData.startTime.split(':')[0])
      const endTime = parseInt(matchData.endTime.split(':')[0])
      if (startTime >= endTime) {
        throw new Error("종료 시간은 시작 시간보다 이후여야 합니다.")
      }
      
      const matchRegist: MatchRegist = {
        matchName: matchData.title,
        courtId: Number(matchData.courtId),
        managerId: Number(matchData.managerId),
        matchDate: matchData.matchDate,
        matchTime: startTime,
        matchEndTime: endTime,
        teamCapacity: Number(matchData.maxParticipants),
        description: matchData.description,
        matchPrice: Number(matchData.fee)
      }

      fetchPostMatchRegist(matchRegist);
      
    } catch (error) {
      toast({
        title: "매치 등록 실패",
        description: error instanceof Error ? error.message : "매치 등록 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const timeFormat = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const facilityTIme = new Date();
    facilityTIme.setHours(hour);
    facilityTIme.setMinutes(minute);

    return format(facilityTIme, "HH:mm");
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-2xl mx-auto p-2 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-bold">매치 정보 등록</h2>
      
      {/* 기본 정보 */}
      <div className="space-y-3 sm:space-y-4">
        <div className="grid gap-3 sm:gap-4">
          <div>
            <Label htmlFor="title" className="text-sm sm:text-base">매치 제목</Label>
            <Input
              id="title"
              name="title"
              placeholder="매치 제목을 입력하세요"
              value={matchData.title}
              onChange={handleInputChange}
              required
              className="mt-1 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <Label htmlFor="sportType" className="text-sm sm:text-base">스포츠 종목</Label>
            <Select
              value={matchData.sportType}
              onValueChange={(value) => handleSportChange(value)}
            >
              <SelectTrigger id="sportType" className="mt-1 h-9 sm:h-10 text-sm sm:text-base">
                <SelectValue placeholder="종목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {sportTypes.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value} className="text-sm sm:text-base">
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* 시설 정보 */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-medium">시설 정보</h3>
        
        <div>
          <Label htmlFor="facilityId" className="text-sm sm:text-base">시설 선택</Label>
          <Select
            value={matchData.facilityId}
            onValueChange={(value) => handleFacilityChange(value)}
            disabled={!matchData.sportType}
          >
            <SelectTrigger id="facilityId" className="mt-1 h-9 sm:h-10 text-sm sm:text-base">
              <SelectValue placeholder="시설을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {facilityNames.length > 0 ? facilityNames.map((facility) => (
                <SelectItem key={facility.facilityId} value={String(facility.facilityId)} className="text-sm sm:text-base">
                  {facility.facilityName}
                </SelectItem>
              )) : "아직 등록된 시설이 없습니다."}
            </SelectContent>
          </Select>
          {!matchData.sportType && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">스포츠 종목을 먼저 선택해주세요.</p>
          )}
        </div>
        
        {selectFacilityName && (
          <div className="grid gap-1 sm:gap-2 text-xs sm:text-sm bg-gray-50 p-2 sm:p-3 rounded-md">
            <p>
              <span className="font-medium">주소:</span> {selectFacilityName.address}
            </p>
            <p>
              <span className="font-medium">운영 시간:</span> {`${timeFormat(selectFacilityName.startTime)}-${timeFormat(selectFacilityName.endTime)}`}
            </p>
          </div>
        )}
        
        {selectFacilityName && (
          <div>
            <Label htmlFor="courtId" className="text-sm sm:text-base">코트 선택</Label>
            <Select
              value={matchData.courtId}
              onValueChange={(value) => handleSelectChange("courtId", value)}
            >
              <SelectTrigger id="courtId" className="mt-1 h-9 sm:h-10 text-sm sm:text-base">
                <SelectValue placeholder="코트를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {courtNames.length > 0 ? courtNames.map((court) => (
                  <SelectItem key={court.courtId} value={String(court.courtId)} className="text-sm sm:text-base">
                    {court.courtName} ({court.courtType})
                  </SelectItem>
                )) : "아직 등록된 코트가 없습니다."}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* 시설 관리자 선택 */}
        {selectFacilityName && (
          <div>
            <Label htmlFor="managerId" className="text-sm sm:text-base">시설 관리자 선택</Label>
            <Select
              value={matchData.managerId || undefined}
              onValueChange={(value) => handleSelectChange("managerId", value)}
            >
              <SelectTrigger id="managerId" className="mt-1 h-9 sm:h-10 text-sm sm:text-base">
                <SelectValue placeholder={loadingManagers ? "로딩 중..." : "매치 관리자를 선택하세요"} />
              </SelectTrigger>
              <SelectContent>
                {managerNames.length > 0 ? (
                  managerNames.map((manager) => (
                    <SelectItem key={manager.managerId} value={manager.managerId.toString()} className="text-sm sm:text-base">
                      {manager.managerName} ({manager.managerEmail})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_managers" disabled className="text-sm sm:text-base">
                    관리자가 없습니다.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {managerNames.length === 0 && !loadingManagers && (
              <Alert className="mt-2" variant="destructive">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  이 시설에 등록된 관리자가 없습니다. 시설 관리 페이지에서 관리자를 추가해주세요.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
      
      {/* 날짜 및 시간 */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-medium">날짜 및 시간</h3>
        
        <div>
          <Label className="text-sm sm:text-base">매치 날짜</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1 h-9 sm:h-10 text-xs sm:text-sm"
                disabled={!selectFacilityName}
              >
                <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {date ? format(date, 'PPP', { locale: ko }) : "날짜를 선택하세요"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  if (newDate) {
                    setMatchData(prev => ({
                      ...prev,
                      matchDate: format(newDate, 'yyyy-MM-dd')
                    }))
                  }
                }}
                disabled={(date) => {
                  const now = new Date()
                  now.setHours(0, 0, 0, 0)
                  return date < now
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="startTime" className="text-sm sm:text-base">시작 시간</Label>
            <Select
              value={matchData.startTime}
              onValueChange={(value) => handleSelectChange("startTime", value)}
              disabled={!date || !matchData.courtId}
            >
              <SelectTrigger id="startTime" className="mt-1 h-9 sm:h-10 text-sm sm:text-base">
                <SelectValue placeholder="시작 시간" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value} className="text-sm sm:text-base">
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="endTime" className="text-sm sm:text-base">종료 시간</Label>
            <Select
              value={matchData.endTime}
              onValueChange={(value) => handleSelectChange("endTime", value)}
              disabled={!date || !matchData.startTime}
            >
              <SelectTrigger id="endTime" className="mt-1 h-9 sm:h-10 text-sm sm:text-base">
                <SelectValue placeholder="종료 시간" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots
                  .filter(slot => {
                    if (!matchData.startTime) return true
                    return parseInt(slot.value) > parseInt(matchData.startTime)
                  })
                  .map((slot) => (
                    <SelectItem key={slot.value} value={slot.value} className="text-sm sm:text-base">
                      {slot.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* 참가 정보 */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-medium">참가 정보</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="maxParticipants" className="text-sm sm:text-base">최대 참가 인원</Label>
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              min="2"
              placeholder="최대 참가 인원"
              value={matchData.maxParticipants}
              onChange={handleInputChange}
              className="mt-1 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <Label htmlFor="fee" className="text-sm sm:text-base">참가비 (원)</Label>
            <Input
              id="fee"
              name="fee"
              type="number"
              min="0"
              placeholder="참가비"
              value={matchData.fee}
              onChange={handleInputChange}
              className="mt-1 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
      
      {/* 추가 정보 */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-medium">추가 정보</h3>
        
        <div>
          <Label htmlFor="description" className="text-sm sm:text-base">매치 설명</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="매치에 대한 추가 정보를 입력하세요"
            value={matchData.description}
            onChange={handleInputChange}
            className="mt-1 min-h-24 sm:min-h-32 text-sm sm:text-base"
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "등록 중..." : "매치 등록하기"}
        </Button>
      </div>
    </form>
  )
} 