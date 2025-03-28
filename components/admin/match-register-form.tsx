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
import { CalendarIcon, Clock } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const sportTypes = [
  { value: "soccer", label: "축구" },
  { value: "futsal", label: "풋살" },
  { value: "basketball", label: "농구" },
  { value: "volleyball", label: "배구" },
  { value: "tennis", label: "테니스" },
  { value: "badminton", label: "배드민턴" },
  { value: "baseball", label: "야구" },
  { value: "other", label: "기타" },
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
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ value: string, label: string }[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [availableCourts, setAvailableCourts] = useState<Court[]>([])
  const [matchData, setMatchData] = useState({
    title: "",
    sportType: "",
    facilityId: "",
    facilityName: "",
    address: "",
    matchDate: "",
    matchTime: "",
    maxParticipants: "",
    fee: "",
    description: "",
    equipmentProvided: false,
    images: [] as File[],
    courtId: "",
    courtName: ""
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
  }, [matchData.sportType, facilities])
  
  // 날짜가 변경될 때 state 업데이트 및 가용 시간대 업데이트
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      setMatchData(prev => ({
        ...prev,
        matchDate: formattedDate
      }))
      
      updateAvailableTimeSlots(formattedDate)
    }
  }, [date, selectedFacility])
  
  // 시설이 선택되면 선택된 시설 정보 업데이트 및 위치 채우기
  useEffect(() => {
    if (matchData.facilityId && facilities.length > 0) {
      const selected = facilities.find(f => f.id === matchData.facilityId) || null
      setSelectedFacility(selected)
      
      if (selected) {
        setMatchData(prev => ({
          ...prev,
          facilityName: selected.name,
          address: selected.address,
          courtId: "" // 시설이 변경되면 코트 선택 초기화
        }))
        
        // 활성화된 코트만 필터링
        const activeCourts = selected.courts?.filter(court => court.isActive) || []
        setAvailableCourts(activeCourts)
        
        if (date) {
          updateAvailableTimeSlots(matchData.matchDate)
        }
      }
    } else {
      setSelectedFacility(null)
      setAvailableCourts([])
      setAvailableTimeSlots([])
    }
  }, [matchData.facilityId, facilities, date])
  
  // 코트가 선택되었을 때 가용 시간대 업데이트
  useEffect(() => {
    if (matchData.facilityId && matchData.courtId && matchData.matchDate) {
      updateAvailableTimeSlots(matchData.matchDate)
    } else {
      setAvailableTimeSlots([])
    }
  }, [matchData.courtId])
  
  // 가용 시간대 업데이트 함수
  const updateAvailableTimeSlots = (selectedDate: string) => {
    if (!selectedFacility || !matchData.courtId) return
    
    // 운영 시간 파싱 (예: 09:00-22:00)
    const [openingTime, closingTime] = selectedFacility.openingHours.split('-')
    const openingHour = parseInt(openingTime.split(':')[0])
    const closingHour = parseInt(closingTime.split(':')[0])
    
    // 해당 날짜에 해당 시설의 해당 코트의 예약 현황 가져오기
    const dateReservations = reservations.filter(res => 
      res.facilityId === selectedFacility.id && 
      res.courtId === matchData.courtId && 
      res.date === selectedDate
    )
    
    // 예약 가능한 시간 계산
    const reservedTimes = new Set<string>()
    dateReservations.forEach(res => {
      const start = parseInt(res.startTime.split(':')[0])
      const end = parseInt(res.endTime.split(':')[0])
      
      for (let hour = start; hour < end; hour++) {
        reservedTimes.add(`${hour < 10 ? '0' + hour : hour}:00`)
      }
    })
    
    // 운영 시간 내 예약 가능한 시간대 계산
    const available = timeSlots.filter(slot => {
      const hour = parseInt(slot.value.split(':')[0])
      return hour >= openingHour && hour < closingHour && !reservedTimes.has(slot.value)
    })
    
    setAvailableTimeSlots(available)
  }
  
  // 입력값 변경 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setMatchData(prev => ({ ...prev, [name]: value }))
  }
  
  // 셀렉트 변경 처리
  const handleSelectChange = (name: string, value: string) => {
    setMatchData(prev => ({ ...prev, [name]: value }))
  }
  
  // 체크박스 변경 처리
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMatchData(prev => ({ ...prev, [name]: checked }))
  }
  
  // 매치 등록 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 실제로는 API 호출로 데이터 저장
      
      // 필수 필드 체크
      if (!matchData.title || !matchData.sportType || !matchData.facilityId || 
          !matchData.courtId || !matchData.matchDate || !matchData.matchTime || 
          !matchData.maxParticipants) {
        throw new Error("필수 정보를 모두 입력해주세요.")
      }
      
      // 완료 처리하기 전에 시작/종료 시간 계산
      const startTime = matchData.matchTime
      // 기본 2시간 추가 (실제로는 사용자가 지정할 수 있게 할 수 있음)
      const startHour = parseInt(startTime.split(':')[0])
      const endHour = startHour + 2
      const endTime = `${endHour < 10 ? '0' + endHour : endHour}:00`
      
      // matchTime 포맷 변경
      const matchTime = `${startTime} - ${endTime}`
      
      // 완료 핸들러 호출
      onComplete({
        ...matchData,
        matchTime
      })
      
      toast({
        title: "매치 등록 완료",
        description: "성공적으로 매치가 등록되었습니다."
      })
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label htmlFor="title" className="text-base">매치명 *</Label>
          <Input
            id="title"
            name="title"
            value={matchData.title}
            onChange={handleInputChange}
            placeholder="예: 주말 테니스 초보자 매치"
            className="h-12 text-base"
            required
          />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="sportType" className="text-base">종목 *</Label>
          <Select 
            value={matchData.sportType} 
            onValueChange={(value) => handleSelectChange('sportType', value)}
          >
            <SelectTrigger id="sportType" className="h-12 text-base">
              <SelectValue placeholder="종목을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {sportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-base py-2">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="facility" className="text-base">시설 *</Label>
        <Select 
          value={matchData.facilityId} 
          onValueChange={(value) => handleSelectChange('facilityId', value)}
          disabled={!matchData.sportType}
        >
          <SelectTrigger id="facility" className="h-12 text-base">
            <SelectValue placeholder={!matchData.sportType ? "먼저 종목을 선택하세요" : "시설을 선택하세요"} />
          </SelectTrigger>
          <SelectContent>
            {filteredFacilities.map((facility) => (
              <SelectItem key={facility.id} value={facility.id} className="text-base py-2">
                {facility.name} ({facility.address})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="court" className="text-base">코트 *</Label>
        <Select 
          value={matchData.courtId} 
          onValueChange={(value) => {
            const selectedCourt = availableCourts.find(c => c.id === value)
            handleSelectChange('courtId', value)
            if (selectedCourt) {
              handleSelectChange('courtName', selectedCourt.name)
            }
          }}
          disabled={!matchData.facilityId || availableCourts.length === 0}
        >
          <SelectTrigger id="court" className="h-12 text-base">
            <SelectValue placeholder={!matchData.facilityId ? "먼저 시설을 선택하세요" : "코트를 선택하세요"} />
          </SelectTrigger>
          <SelectContent>
            {availableCourts.map((court) => (
              <SelectItem key={court.id} value={court.id} className="text-base py-2">
                {court.name} ({court.width}m × {court.height}m, {court.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label className="text-base">날짜 *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-12 text-base"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date ? format(date, 'PPP', { locale: ko }) : "날짜를 선택하세요"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className="rounded-md border shadow p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="matchTime" className="text-base">시작 시간 *</Label>
          <Select 
            value={matchData.matchTime} 
            onValueChange={(value) => handleSelectChange('matchTime', value)}
            disabled={!matchData.facilityId || !matchData.courtId || !matchData.matchDate}
          >
            <SelectTrigger id="matchTime" className="h-12 text-base">
              <SelectValue placeholder={!matchData.facilityId || !matchData.courtId || !matchData.matchDate ? "먼저 시설, 코트, 날짜를 선택하세요" : "시간을 선택하세요"} />
            </SelectTrigger>
            <SelectContent>
              {availableTimeSlots.map((slot) => (
                <SelectItem key={slot.value} value={slot.value} className="text-base py-2">
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="maxParticipants" className="text-base">최대 참가자 수 *</Label>
        <Input
          id="maxParticipants"
          name="maxParticipants"
          type="number"
          min="2"
          value={matchData.maxParticipants}
          onChange={handleInputChange}
          placeholder="예: 8"
          className="h-12 text-base"
          required
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="fee" className="text-base">참가비</Label>
        <Input
          id="fee"
          name="fee"
          value={matchData.fee}
          onChange={handleInputChange}
          placeholder="예: 10000"
          className="h-12 text-base"
        />
      </div>
      
      <div className="flex items-center space-x-3 mt-6">
        <Checkbox 
          id="equipmentProvided" 
          checked={matchData.equipmentProvided}
          onCheckedChange={(checked) => 
            handleCheckboxChange('equipmentProvided', checked as boolean)
          }
          className="h-5 w-5"
        />
        <Label htmlFor="equipmentProvided" className="text-base">장비 제공 여부</Label>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="description" className="text-base">상세 설명</Label>
        <Textarea
          id="description"
          name="description"
          value={matchData.description}
          onChange={handleInputChange}
          placeholder="매치에 대한 상세 설명을 입력하세요"
          className="min-h-[120px] text-base"
        />
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto h-12 text-base"
        >
          {isLoading ? "등록 중..." : "매치 등록하기"}
        </Button>
      </div>
    </form>
  )
} 