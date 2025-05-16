"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/hooks/use-toast"
import { format, parse } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { matchService } from "@/lib/services/matchService"
import { SportType } from "@/lib/enum/matchEnum"
import { CourtName, FacilityManagerName, FacilityNames } from "@/lib/types/facilityTypes"
import { facilityService } from "@/lib/services/facilityService"
import { AdminMatchDetail, MatchRegist } from "@/lib/types/matchTypes"

const sportTypes = [
  { value: "SOCCER", label: "축구" },
  { value: "FUTSAL", label: "풋살" },
  { value: "BASKETBALL", label: "농구" },
  { value: "TENNIS", label: "테니스" },
  { value: "BADMINTON", label: "배드민턴" },
  { value: "BASEBALL", label: "야구" },
]

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : `${i}`
  return { value: `${hour}:00`, label: `${hour}:00` }
})

type EditMatchFormProps = {
  matchId: number;
  initialData: AdminMatchDetail;
  onComplete: () => void;
}

export default function EditMatchForm({ matchId, initialData, onComplete }: EditMatchFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  // 시설 이름 조회
  const [facilityNames, setFacilityNames] = useState<FacilityNames[]>([]);
  const [selectFacilityName, setSelectFacilityName] = useState<FacilityNames | null>(null);

  // 코트 이름 조회
  const [courtNames, setCourtNames] = useState<CourtName[]>([]);

  // 시설 매니저 이름 조회
  const [managerNames, setManagerNames] = useState<FacilityManagerName[]>([]);

  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ value: string, label: string }[]>([])
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
  
  // 초기 데이터 로드
  useEffect(() => {
    if (initialData) {
      try {
        const matchDate = initialData.matchDate;
        const parsedDate = parse(matchDate, 'yyyy-MM-dd', new Date());
        setDate(parsedDate);
        
        // API에서 숫자로 오는 시간을 처리 (로깅 추가)
        console.log("원본 시간 데이터:", initialData.matchTime, initialData.endTime);
        
        // 시작 시간과 종료 시간 파싱 (숫자 형식)
        let startTimeHour = 0;
        let endTimeHour = 0;
        
        // 숫자 값이 6시는 600, 12시는 1200과 같이 표현됨
        if (typeof initialData.matchTime === 'number') {
          startTimeHour = Math.floor(initialData.matchTime / 100);
        }
        
        if (typeof initialData.endTime === 'number') {
          endTimeHour = Math.floor(initialData.endTime / 100);
        }
        
        console.log("파싱된 시간 (시간만):", startTimeHour, endTimeHour);
        
        // 시작 시간 및 종료 시간 포맷팅
        const formattedStartTime = startTimeHour < 10 ? `0${startTimeHour}:00` : `${startTimeHour}:00`;
        const formattedEndTime = endTimeHour < 10 ? `0${endTimeHour}:00` : `${endTimeHour}:00`;
        
        console.log("포맷팅된 시간:", formattedStartTime, formattedEndTime);

        // 기본 시간대 설정 (시간 선택이 가능하도록)
        const defaultTimeSlots = Array.from(
          { length: 24 },
          (_, i) => {
            const hour = i;
            const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
            return { value: formattedHour, label: formattedHour };
          }
        );
        setAvailableTimeSlots(defaultTimeSlots);

        // 기본 데이터 설정
        setMatchData({
          title: initialData.matchTitle,
          sportType: initialData.sportType,
          facilityId: "", // 이 부분은 API에서 받아오거나 찾아야 함
          facilityName: initialData.facilityName,
          address: initialData.address,
          matchDate: matchDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          maxParticipants: initialData.teamCapacity.toString(),
          fee: initialData.matchPrice.toString(),
          description: initialData.description || "",
          courtId: "", // 이 부분은 API에서 받아오거나 찾아야 함
          courtName: initialData.facilityCourt,
          managerId: "" // 이 부분은 API에서 받아오거나 찾아야 함
        });
        
        // 스포츠 타입으로 시설 목록 로드 (마지막에 실행)
        fetchGetFacilities(initialData.sportType);
      } catch (error) {
        console.error("초기 데이터 로드 중 오류 발생:", error);
        toast({
          title: "데이터 로드 오류",
          description: "매치 정보를 로드하는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    }
  }, [initialData]);
  
  // 스포츠 타입에 따라 시설 필터링
  useEffect(() => {
    // 스포츠 타입이 변경되면 시설 선택 초기화
    if (!initialData) {
      setMatchData(prev => ({
        ...prev,
        facilityId: "",
        facilityName: "",
        courtId: "",
        courtName: "",
        managerId: ""
      }))
      setSelectFacilityName(null);
      setCourtNames([]);
      setManagerNames([])
    }
  }, [matchData.sportType, facilityNames])
  
  // 시설 선택에 따라 코트 필터링 및 시설 정보 업데이트
  useEffect(() => {
    if (matchData.facilityId) {
      const facility = facilityNames.find(f => f.facilityId === parseInt(matchData.facilityId))
      setSelectFacilityName(facility || null);
      
      if (facility) {
        // 시설 주소 자동 설정 및 시간 정보 유지
        setMatchData(prev => ({
          ...prev,
          facilityName: facility.facilityName,
          address: facility.address
        }));
        
        // 먼저 코트 정보 로드
        fetchGetCourts(facility.facilityId);
        
        // 그 다음 매니저 정보 로드
        fetchGetFacilityManger(facility.facilityId);
        
        // 시설 정보가 로드되었으므로 시간 범위를 업데이트 (기존 선택된 시간 유지)
        if (date) {
          updateAvailableTimeSlots(format(date, 'yyyy-MM-dd'));
        }
      }
    }
  }, [matchData.facilityId, facilityNames]);
  
  // 매치 날짜 선택 시 가능한 시간대 업데이트
  useEffect(() => {
    if (date) {
      // 날짜가 선택되면 시간대 업데이트
      updateAvailableTimeSlots(format(date, 'yyyy-MM-dd'));
    } else {
      // 날짜를 선택하지 않은 경우에도 기본 시간대 제공
      const defaultTimeSlots = generateDefaultTimeSlots();
      setAvailableTimeSlots(defaultTimeSlots);
    }
  }, [date]);
  
  // 기본 시간대 생성 함수
  const generateDefaultTimeSlots = () => {
    return Array.from(
      { length: 24 },
      (_, i) => {
        const hour = i;
        const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        return { value: formattedHour, label: formattedHour };
      }
    );
  }

  // 사용 가능 시간대 계산
  const updateAvailableTimeSlots = (selectedDate: string) => {
    try {
      // 기본 시간대 (오전 6시부터 오후 12시까지)
      const defaultTimeSlots = Array.from(
        { length: 19 }, // 6시부터 24시까지 (19개 시간)
        (_, i) => {
          const hour = 6 + i;
          const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
          return { value: `${formattedHour}:00`, label: `${formattedHour}:00` };
        }
      );
      
      // 시설 정보가 없으면 기본 시간대 사용
      if (!selectFacilityName) {
        console.log("시설 정보가 아직 로드되지 않았습니다. 기본 시간대 사용.");
        setAvailableTimeSlots(defaultTimeSlots);
        return;
      }
      
      // 필요한 속성이 있는지 체크
      if (!selectFacilityName.startTime || !selectFacilityName.endTime) {
        console.log("시설의 시작 시간 또는 종료 시간 정보가 없습니다. 기본 시간대 사용.", selectFacilityName);
        setAvailableTimeSlots(defaultTimeSlots);
        return;
      }
      
      // 운영 시간 파싱 (안전하게 처리)
      const openHour = parseInt(selectFacilityName.startTime.split(':')[0]) || 9; // 기본값 9시
      let closeHour = parseInt(selectFacilityName.endTime.split(':')[0]) || 18; // 기본값 18시
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

      console.log("생성된 시간대:", operatingTimeSlots);
      console.log("현재 선택된 시간:", matchData.startTime, matchData.endTime);
      
      setAvailableTimeSlots(operatingTimeSlots)
    } catch (error) {
      console.error("시간대 계산 중 오류 발생:", error);
      // 오류 발생 시 기본 시간대 설정 (전체 시간대)
      const defaultTimeSlots = Array.from(
        { length: 24 },
        (_, i) => {
          const hour = i;
          const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
          return { value: formattedHour, label: formattedHour };
        }
      );
      setAvailableTimeSlots(defaultTimeSlots);
    }
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
      
      // 초기 데이터가 있는 경우 시설 ID 찾기
      if (initialData && facilityNames.length > 0) {
        const facility = facilityNames.find(f => f.facilityName === initialData.facilityName);
        if (facility) {
          console.log("시설 정보 찾음:", facility);
          setMatchData(prev => ({
            ...prev,
            facilityId: facility.facilityId.toString()
          }));
        } else {
          console.log("시설 정보를 찾을 수 없음. 첫 번째 시설 선택:", facilityNames[0]);
          // 일치하는 시설이 없으면 첫 번째 시설 선택
          setMatchData(prev => ({
            ...prev,
            facilityId: facilityNames[0].facilityId.toString(),
            facilityName: facilityNames[0].facilityName
          }));
        }
      }
    } catch(error: any) {
      console.log("시설 조회 오류:", error);
      // 에러 메시지 표시
      toast({
        title: "시설 조회 실패",
        description: error?.message || "시설 정보를 불러오는 중 오류가 발생했습니다. 권한을 확인해 주세요.",
        variant: "destructive"
      });
      
      // 에러가 발생해도 폼이 작동하도록 빈 시설 목록 설정
      setFacilityNames([]);
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
      setCourtNames(courts);
      
      // 초기 데이터가 있는 경우 코트 ID 찾기
      if (initialData && courts.length > 0) {
        const court = courts.find(c => c.courtName === initialData.facilityCourt);
        if (court) {
          setMatchData(prev => ({
            ...prev,
            courtId: court.courtId.toString(),
            courtName: court.courtName
          }));
        }
      }
    } catch(error: any) {
      // 로그인 페이지로 바로 리디렉션하지 않고 에러 메시지만 표시
      toast({
        title: "코트 조회 실패",
        description: error?.message || "코트 정보를 불러오는 중 오류가 발생했습니다. 권한을 확인해 주세요.",
        variant: "destructive"
      });
    }
  }

  // 시설 관리자 조회
  const fetchGetFacilityManger = async (facilityId: number) => {
    try {
      setLoadingManagers(true);
      const facilityMangers: FacilityManagerName[] = await facilityService.getFacilityMangerNames(facilityId);
      setManagerNames(facilityMangers);
      
      // 매니저 데이터가 있으면 첫 번째 매니저를 기본값으로 설정
      if (facilityMangers.length > 0 && !matchData.managerId) {
        setMatchData(prev => ({
          ...prev,
          managerId: facilityMangers[0].managerId.toString()
        }));
      }
    } catch(error: any) {
      console.error("매니저 조회 오류:", error);
      // 에러 메시지 표시
      toast({
        title: "매니저 조회 실패",
        description: error?.message || "매니저 정보를 불러오는 중 오류가 발생했습니다. 권한을 확인해 주세요.",
        variant: "destructive"
      });
      
      // 에러가 발생해도 매니저 선택이 가능하도록 빈 배열 설정
      setManagerNames([]);
    } finally {
      setLoadingManagers(false);
    }
  }

  const handleFacilityChange = (value: string) => {
    setMatchData(prev => ({
      ...prev,
      facilityId: value
    }))
  }

  const handleCourtChange = (value: string) => {
    const selectedCourt = courtNames.find(c => c.courtId === parseInt(value))
    
    setMatchData(prev => ({
      ...prev,
      courtId: value,
      courtName: selectedCourt ? selectedCourt.courtName : ""
    }))
  }

  const handleManagerChange = (value: string) => {
    setMatchData(prev => ({
      ...prev,
      managerId: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setMatchData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (value: Date | undefined) => {
    setDate(value)
    
    if (value) {
      setMatchData(prev => ({
        ...prev,
        matchDate: format(value, 'yyyy-MM-dd')
      }))
    }
  }

  const timeFormat = (time: string): string => {
    if (!time || time === "" || time === "none") return "0";
    const [hour, minute] = time.split(":");
    if (hour === undefined) return "0";
    return hour + (minute || "00");
  }

  const fetchPutMatchUpdate = async (params: MatchRegist) => {
    setIsLoading(true);

    try {
      console.log("매치 수정 데이터:", params);
      
      // 시작 시간과 종료 시간 유효성 검사
      if (!params.matchTime || !params.matchEndTime) {
        toast({
          title: "시간 정보 오류",
          description: "시작 시간과 종료 시간을 확인해 주세요.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // 먼저 타입을 문자열로 변환해서 API 호출
      const updateData: Record<string, any> = {
        title: params.matchName,
        sportType: matchData.sportType,
        facilityId: parseInt(matchData.facilityId),
        matchDate: params.matchDate,
        matchTime: `${matchData.startTime} - ${matchData.endTime}`,
        maxParticipants: parseInt(params.teamCapacity.toString()),
        fee: parseInt(params.matchPrice.toString()),
        description: params.description || undefined,
        courtId: parseInt(matchData.courtId),
        managerId: params.managerId ? parseInt(params.managerId.toString()) : undefined
      };
      
      await matchService.updateMatch(matchId, updateData as any);

      toast({
        title: "매치 수정 완료",
        description: "매치 정보가 성공적으로 수정되었습니다."
      });

      onComplete();
    } catch (error: any) {
      console.error("매치 수정 오류:", error);
      toast({
        title: "매치 수정 실패",
        description: error?.message || "매치 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 필수 필드 검증
    if (!matchData.title.trim()) {
      toast({
        title: "매치 제목 필요",
        description: "매치 제목을 입력해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.sportType) {
      toast({
        title: "스포츠 종목 선택 필요",
        description: "스포츠 종목을 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.facilityId) {
      toast({
        title: "시설 선택 필요",
        description: "매치가 진행될 시설을 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.courtId) {
      toast({
        title: "코트 선택 필요",
        description: "매치가 진행될 코트를 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.matchDate) {
      toast({
        title: "매치 날짜 선택 필요",
        description: "매치 날짜를 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.startTime || !matchData.endTime || matchData.startTime === "none" || matchData.endTime === "none") {
      toast({
        title: "매치 시간 선택 필요",
        description: "매치 시작 및 종료 시간을 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.maxParticipants) {
      toast({
        title: "참가자 수 입력 필요",
        description: "최대 참가자 수를 입력해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.fee) {
      toast({
        title: "참가 비용 입력 필요",
        description: "참가 비용을 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    // 시작 시간과 종료 시간이 올바른지 확인
    const startHour = parseInt(matchData.startTime.split(':')[0]);
    const endHour = parseInt(matchData.endTime.split(':')[0]);
    
    if (endHour <= startHour) {
      toast({
        title: "시간 선택 오류",
        description: "종료 시간은 시작 시간보다 나중이어야 합니다.",
        variant: "destructive"
      });
      return;
    }

    const matchRegist: MatchRegist = {
      matchName: matchData.title,
      courtId: parseInt(matchData.courtId),
      managerId: parseInt(matchData.managerId || "0"),
      matchDate: matchData.matchDate,
      matchTime: parseInt(timeFormat(matchData.startTime)),
      matchEndTime: parseInt(timeFormat(matchData.endTime)),
      teamCapacity: parseInt(matchData.maxParticipants),
      description: matchData.description || null,
      matchPrice: parseInt(matchData.fee)
    }

    console.log("제출 데이터:", matchRegist);
    fetchPutMatchUpdate(matchRegist)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <h2 className="text-2xl font-bold">매치 수정</h2>
      <p className="text-gray-500 mb-6">아래 양식을 작성하여 매치 정보를 수정하세요.</p>
      
      <div className="space-y-4">
        {/* 기본 정보 */}
        <div>
          <Label htmlFor="title" className="text-base font-semibold">매치 제목</Label>
          <Input
            id="title"
            name="title"
            value={matchData.title}
            onChange={handleInputChange}
            placeholder="매치 제목을 입력하세요"
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="sportType" className="text-base font-semibold">스포츠 종목</Label>
            <Select 
              value={matchData.sportType} 
              onValueChange={handleSportChange}
            >
              <SelectTrigger id="sportType" className="mt-1">
                <SelectValue placeholder="종목 선택" />
              </SelectTrigger>
              <SelectContent>
                {sportTypes.map(sport => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="facilityId" className="text-base font-semibold">시설</Label>
            <Select 
              value={matchData.facilityId} 
              onValueChange={handleFacilityChange}
              disabled={facilityNames.length === 0}
            >
              <SelectTrigger id="facilityId" className="mt-1">
                <SelectValue placeholder="시설 선택" />
              </SelectTrigger>
              <SelectContent>
                {facilityNames.map(facility => (
                  <SelectItem 
                    key={facility.facilityId} 
                    value={facility.facilityId.toString()}
                  >
                    {facility.facilityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="courtId" className="text-base font-semibold">코트</Label>
            <Select 
              value={matchData.courtId} 
              onValueChange={handleCourtChange}
              disabled={courtNames.length === 0}
            >
              <SelectTrigger id="courtId" className="mt-1">
                <SelectValue placeholder="코트 선택" />
              </SelectTrigger>
              <SelectContent>
                {courtNames.map(court => (
                  <SelectItem 
                    key={court.courtId} 
                    value={court.courtId.toString()}
                  >
                    {court.courtName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="managerId" className="text-base font-semibold">매니저</Label>
            <Select 
              value={matchData.managerId} 
              onValueChange={handleManagerChange}
              disabled={loadingManagers}
            >
              <SelectTrigger id="managerId" className="mt-1">
                <SelectValue placeholder={loadingManagers ? "로딩 중..." : "매니저 선택"} />
              </SelectTrigger>
              <SelectContent>
                {managerNames.length > 0 ? (
                  managerNames.map(manager => (
                    <SelectItem 
                      key={manager.managerId} 
                      value={manager.managerId.toString()}
                    >
                      {manager.managerName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none">매니저 정보 없음</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 날짜 및 시간 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="text-base font-semibold">매치 날짜</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal"
                >
                  {date ? (
                    format(date, 'PPP', { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  locale={ko}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="startTime" className="text-base font-semibold">시작 시간</Label>
            <Select 
              value={matchData.startTime} 
              onValueChange={(value) => handleSelectChange("startTime", value)}
              disabled={availableTimeSlots.length === 0}
            >
              <SelectTrigger id="startTime" className="mt-1">
                <SelectValue placeholder="시작 시간" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map(timeSlot => (
                    <SelectItem key={timeSlot.value} value={timeSlot.value}>
                      {timeSlot.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none">시간 정보 없음</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="endTime" className="text-base font-semibold">종료 시간</Label>
            <Select 
              value={matchData.endTime} 
              onValueChange={(value) => handleSelectChange("endTime", value)}
              disabled={!matchData.startTime || availableTimeSlots.length === 0}
            >
              <SelectTrigger id="endTime" className="mt-1">
                <SelectValue placeholder="종료 시간" />
              </SelectTrigger>
              <SelectContent>
                {matchData.startTime && availableTimeSlots.length > 0 ? (
                  availableTimeSlots
                    .filter(slot => {
                      if (!matchData.startTime) return true
                      return parseInt(slot.value.split(':')[0]) > parseInt(matchData.startTime.split(':')[0])
                    })
                    .map(timeSlot => (
                      <SelectItem key={timeSlot.value} value={timeSlot.value}>
                        {timeSlot.label}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="none">시간 정보 없음</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 참가자 및 비용 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="maxParticipants" className="text-base font-semibold">최대 참가자 수</Label>
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              min="2"
              value={matchData.maxParticipants}
              onChange={handleInputChange}
              placeholder="예: 8"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="fee" className="text-base font-semibold">참가 비용 (원)</Label>
            <Input
              id="fee"
              name="fee"
              type="number"
              min="0"
              value={matchData.fee}
              onChange={handleInputChange}
              placeholder="예: 10000"
              className="mt-1"
            />
          </div>
        </div>
        
        {/* 설명 */}
        <div>
          <Label htmlFor="description" className="text-base font-semibold">매치 설명 (선택사항)</Label>
          <Textarea
            id="description"
            name="description"
            value={matchData.description}
            onChange={handleInputChange}
            placeholder="매치에 대한 추가 설명을 입력하세요"
            className="mt-1 h-24"
          />
        </div>
      </div>
      
      <Alert className="bg-amber-50 text-amber-800 border-amber-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          이미 참가자가 있는 매치의 정보를 수정하는 경우 참가자에게 알림이 발송됩니다.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onComplete}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "처리 중..." : "매치 수정"}
        </Button>
      </div>
    </form>
  )
} 