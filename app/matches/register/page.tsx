"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
}

// 예약 현황 타입 정의
type Reservation = {
  facilityId: string;
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
    openingHours: "09:00-22:00"
  },
  {
    id: "2",
    name: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "futsal",
    openingHours: "08:00-23:00"
  },
  {
    id: "3",
    name: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "basketball",
    openingHours: "10:00-20:00"
  },
  {
    id: "4",
    name: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "badminton",
    openingHours: "08:00-22:00"
  }
]

// 더미 예약 데이터
const dummyReservations: Reservation[] = [
  {
    facilityId: "1",
    date: "2025-03-28",
    startTime: "10:00",
    endTime: "12:00"
  },
  {
    facilityId: "1",
    date: "2025-03-28",
    startTime: "16:00",
    endTime: "18:00"
  },
  {
    facilityId: "2",
    date: "2025-03-29",
    startTime: "18:00",
    endTime: "20:00"
  }
]

export default function RegisterMatchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ value: string, label: string }[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [matchData, setMatchData] = useState({
    title: "",
    sportType: "",
    facilityId: "",
    date: "",
    startTime: "",
    endTime: "",
    skillLevel: "",
    maxParticipants: "",
    fee: "",
    description: "",
    gender: "all", // all, male, female
    equipmentProvided: false,
    images: [] as File[]
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
        date: formattedDate
      }))
      
      updateAvailableTimeSlots(formattedDate)
    }
  }, [date, selectedFacility])
  
  // 시설이 선택되면 선택된 시설 정보 업데이트 및 위치 채우기
  useEffect(() => {
    if (matchData.facilityId && facilities.length > 0) {
      const selected = facilities.find(f => f.id === matchData.facilityId) || null
      setSelectedFacility(selected)
      
      if (selected && date) {
        updateAvailableTimeSlots(matchData.date)
      }
    } else {
      setSelectedFacility(null)
      setAvailableTimeSlots([])
    }
  }, [matchData.facilityId, facilities])
  
  // 가용 시간대 업데이트 함수
  const updateAvailableTimeSlots = (selectedDate: string) => {
    if (!selectedFacility) return
    
    // 운영 시간 파싱 (예: 09:00-22:00)
    const [openingTime, closingTime] = selectedFacility.openingHours.split('-')
    const openingHour = parseInt(openingTime.split(':')[0])
    const closingHour = parseInt(closingTime.split(':')[0])
    
    // 해당 날짜에 해당 시설의 예약 현황 가져오기
    const dateReservations = reservations.filter(res => 
      res.facilityId === selectedFacility.id && res.date === selectedDate
    )
    
    // 모든 시간대 생성
    const allSlots: { value: string, label: string }[] = []
    for (let hour = openingHour; hour < closingHour; hour++) {
      const hourStr = hour < 10 ? `0${hour}` : `${hour}`
      allSlots.push({ value: `${hourStr}:00`, label: `${hourStr}:00` })
    }
    
    // 예약된 시간대 제외
    const available = allSlots.filter(slot => {
      const hour = parseInt(slot.value.split(':')[0])
      return !dateReservations.some(res => {
        const startHour = parseInt(res.startTime.split(':')[0])
        const endHour = parseInt(res.endTime.split(':')[0])
        return hour >= startHour && hour < endHour
      })
    })
    
    setAvailableTimeSlots(available)
  }
  
  // 로그인 확인
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!loggedIn) {
      toast({
        title: "로그인이 필요합니다",
        description: "매치 등록을 위해 로그인이 필요합니다.",
        variant: "destructive",
      })
      router.push('/login')
    }
  }, [router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMatchData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setMatchData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMatchData(prev => ({ ...prev, [name]: checked }))
  }
  
  const handleTimeChange = (name: string, value: string) => {
    setMatchData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setMatchData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }))
    }
  }
  
  const handleRemoveImage = (index: number) => {
    setMatchData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 실제로는 API 호출하여 서버에 전송
      // 테스트를 위한 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "매치 등록 완료",
        description: "매치가 성공적으로 등록되었습니다.",
      })
      
      // 등록 완료 후 매치 목록 페이지로 이동
      router.push('/matches')
    } catch (error) {
      toast({
        title: "매치 등록 실패",
        description: "매치 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">매치 등록</h1>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>매치 정보 입력</CardTitle>
          <CardDescription>
            아래 양식을 작성하여 새로운 소셜 매치를 등록하세요.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">매치 제목 <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={matchData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="예: 주말 오전 5대5 축구 한 판!"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sportType">스포츠 유형 <span className="text-red-500">*</span></Label>
                  <Select
                    value={matchData.sportType}
                    onValueChange={(value) => handleSelectChange("sportType", value)}
                    required
                  >
                    <SelectTrigger id="sportType">
                      <SelectValue placeholder="스포츠 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportTypes.map((sport) => (
                        <SelectItem key={sport.value} value={sport.value}>
                          {sport.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skillLevel">실력 수준 <span className="text-red-500">*</span></Label>
                  <Select
                    value={matchData.skillLevel}
                    onValueChange={(value) => handleSelectChange("skillLevel", value)}
                    required
                  >
                    <SelectTrigger id="skillLevel">
                      <SelectValue placeholder="실력 수준 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facilityId">시설 선택 <span className="text-red-500">*</span></Label>
                <Select
                  value={matchData.facilityId}
                  onValueChange={(value) => handleSelectChange("facilityId", value)}
                  required
                  disabled={filteredFacilities.length === 0}
                >
                  <SelectTrigger id="facilityId">
                    <SelectValue placeholder={filteredFacilities.length === 0 
                      ? "먼저 스포츠 유형을 선택해주세요" 
                      : "시설을 선택해주세요"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredFacilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name} ({facility.address})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFacility && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-500">운영 시간: {selectedFacility.openingHours}</p>
                    <p className="text-sm text-gray-500">{selectedFacility.address}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">날짜 <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}
                        disabled={!selectedFacility}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: ko }) : "날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ko}
                        disabled={!selectedFacility || (date => date < new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime">시작 시간 <span className="text-red-500">*</span></Label>
                  <Select
                    value={matchData.startTime}
                    onValueChange={(value) => handleTimeChange("startTime", value)}
                    required
                    disabled={availableTimeSlots.length === 0 || !date}
                  >
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder={availableTimeSlots.length === 0 
                        ? "먼저 날짜를 선택해주세요" 
                        : "시작 시간"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((time) => (
                        <SelectItem key={`start-${time.value}`} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">종료 시간 <span className="text-red-500">*</span></Label>
                  <Select
                    value={matchData.endTime}
                    onValueChange={(value) => handleTimeChange("endTime", value)}
                    required
                    disabled={!matchData.startTime || availableTimeSlots.length === 0}
                  >
                    <SelectTrigger id="endTime">
                      <SelectValue placeholder={!matchData.startTime 
                        ? "먼저 시작 시간을 선택해주세요" 
                        : "종료 시간"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots
                        .filter(time => {
                          if (!matchData.startTime) return false
                          const startHour = parseInt(matchData.startTime.split(':')[0])
                          const timeHour = parseInt(time.value.split(':')[0])
                          return timeHour > startHour
                        })
                        .map((time) => (
                          <SelectItem key={`end-${time.value}`} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">최대 참가자 수 <span className="text-red-500">*</span></Label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    min="2"
                    max="100"
                    value={matchData.maxParticipants}
                    onChange={handleInputChange}
                    required
                    placeholder="예: 10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fee">참가비 <span className="text-red-500">*</span></Label>
                  <Input
                    id="fee"
                    name="fee"
                    value={matchData.fee}
                    onChange={handleInputChange}
                    required
                    placeholder="예: 10000"
                  />
                  <p className="text-xs text-gray-500">숫자만 입력 (원 단위)</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>성별 제한</Label>
                <RadioGroup
                  value={matchData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex flex-row space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="gender-all" />
                    <Label htmlFor="gender-all" className="font-normal cursor-pointer">제한 없음</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male" className="font-normal cursor-pointer">남성만</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female" className="font-normal cursor-pointer">여성만</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="equipmentProvided"
                  checked={matchData.equipmentProvided}
                  onCheckedChange={(checked) => handleCheckboxChange("equipmentProvided", checked as boolean)}
                />
                <Label
                  htmlFor="equipmentProvided"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  장비 제공
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">매치 설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={matchData.description}
                  onChange={handleInputChange}
                  placeholder="매치에 대한 상세 설명을 입력하세요..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="images">매치 사진</Label>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 h-auto py-2">
                    <TabsTrigger value="upload" className="py-2">파일 선택</TabsTrigger>
                    <TabsTrigger value="preview" disabled={matchData.images.length === 0} className="py-2">
                      {matchData.images.length > 0 ? `선택된 파일 (${matchData.images.length})` : "선택된 파일 없음"}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="pt-4 pb-6">
                    <div className="w-full p-2 border border-gray-200 rounded-md">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="h-auto py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 mb-2">최대 5MB 크기의 이미지 파일을 여러 개 선택할 수 있습니다.</p>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="pt-4 pb-6">
                    {matchData.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {matchData.images.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-70 hover:opacity-100"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">선택된 파일이 없습니다.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-[120px]"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="w-[120px] bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "등록 중..." : "등록하기"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* 모바일 하단 네비게이션용 여백 */}
      <div className="h-16 md:hidden"></div>
    </div>
  )
} 