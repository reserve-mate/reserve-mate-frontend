"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Phone, Clock, Star, Info, ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { facilityService } from "@/lib/services/facilityService"
import { displayDayOfWeek, FacilityDetail } from "@/lib/types/facilityTypes"
import { displaySportName } from "@/lib/types/matchTypes"
import { reservationService } from "@/lib/services/reservationService"

// 시간 파싱 함수
const parseOperatingHours = (operatingHours: string) => {
  const weekdayMatch = operatingHours.match(/평일\s+(\d{2}:\d{2})\s+-\s+(\d{2}:\d{2})/)
  const weekendMatch = operatingHours.match(/주말\s+(\d{2}:\d{2})\s+-\s+(\d{2}:\d{2})/)
  
  const weekdayHours = weekdayMatch ? {
    start: parseInt(weekdayMatch[1].split(':')[0], 10),
    end: parseInt(weekdayMatch[2].split(':')[0], 10)
  } : { start: 9, end: 18 }
  
  const weekendHours = weekendMatch ? {
    start: parseInt(weekendMatch[1].split(':')[0], 10),
    end: parseInt(weekendMatch[2].split(':')[0], 10)
  } : { start: 9, end: 18 }
  
  return { weekdayHours, weekendHours }
}

// 시간 슬롯 생성 함수
const generateTimeSlots = (date: Date | undefined, operatingHours: string) => {
  if (!date) return []
  
  const { weekdayHours, weekendHours } = parseOperatingHours(operatingHours)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  
  const { start, end } = isWeekend ? weekendHours : weekdayHours
  
  const slots = []
  for (let hour = start; hour < end; hour++) {
    slots.push({
      id: hour,
      display: `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`,
      hour: hour
    })
  }
  return slots
}

// 연속된 시간인지 확인하는 함수
const isConsecutive = (hours: number[]) => {
  if (hours.length <= 1) return true
  const sorted = [...hours].sort((a, b) => a - b)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== 1) {
      return false
    }
  }
  return true
}

// 시간 범위를 문자열로 변환하는 함수
const formatTimeRange = (hours: number[]) => {
  if (hours.length === 0) return ""
  if (hours.length === 1) {
    const hour = hours[0]
    return `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`
  }
  
  const sorted = [...hours].sort((a, b) => a - b)
  const start = sorted[0]
  const end = sorted[sorted.length - 1] + 1
  
  return `${start.toString().padStart(2, "0")}:00 - ${end.toString().padStart(2, "0")}:00`
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sportmate.site/';

export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([])
  const [timeSlots, setTimeSlots] = useState<Array<{id: number, display: string, hour: number}>>([])

  const [timeSlot, setTimeSlot] = useState<string[]>([]);

  // 시설 상세
  const [facilityDetail, setFacilityDetail] = useState<FacilityDetail | null>(null);
  const [expanded, setExpanded] = useState(false);

  // 시설 상세 초기화
  useEffect(() => {

    const getFacilityDetail = async () => {
      try {
        const response = await facilityService.getFacilityDetail(parseInt(params.id));
        setFacilityDetail(response);
      }catch(error) {
        toast({
          title: "조회 오류",
          description: (error instanceof Error) ? error.message : "데이터를 불러오는 중 에러가 발생하였습니다.",
          variant: "destructive",
        })
        router.back();
      }
      
    }

    getFacilityDetail();

  }, [params.id])

  // 날짜가 변경될 때 가능한 시간 슬롯 업데이트
  useEffect(() => {
    // setTimeSlots(generateTimeSlots(date, facility.operatingHours))
    setSelectedTimeSlots([]) // 날짜가 변경되면 선택된 시간 초기화
    // 예약 가능 시간 조회
    const getPossibleHours = async () => {
      try {
        const formattedDate = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");  // 날짜 포맷 수정
        const response = await reservationService.getPossibleHours(parseInt(params.id), formattedDate);
        setTimeSlot(response);
        // setTimeSlots(generateTimeSlots(date, facility.operatingHours))
      } catch (error) {
        toast({
          title: "조회 오류",
          description: (error instanceof Error) ? error.message : "예약 가능 시간을 불러오는데 오류가 발생하였습니다.",
          variant: "destructive",
        })
        setSelectedTimeSlots([]) // 날짜가 변경되면 선택된 시간 초기화
      }
      
    }
    
    getPossibleHours();
  }, [date])

  const handleTimeSlotClick = (hour: number) => {
    const newSelectedSlots = selectedTimeSlots.includes(hour)
      ? selectedTimeSlots.filter(h => h !== hour)
      : [...selectedTimeSlots, hour]

    // 최대 3시간 제한
    if (newSelectedSlots.length > 3) {
      toast({
        title: "선택 제한",
        description: "최대 3시간까지만 선택할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    // 연속된 시간인지 확인
    if (!isConsecutive(newSelectedSlots)) {
      toast({
        title: "시간 선택 오류",
        description: "연속된 시간대만 선택할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    setSelectedTimeSlots(newSelectedSlots)
  }

  const handleReservation = () => {
    if (!selectedCourt || selectedTimeSlots.length === 0 || !date) {
      toast({
        title: "예약 정보 부족",
        description: "코트, 날짜, 시간을 모두 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    // 예약 정보를 세션에 저장하거나 상태 관리 라이브러리에 저장
    // const reservationData = {
    //   facilityId: facility.id,
    //   facilityName: facility.name,
    //   courtId: selectedCourt,
    //   courtName: facility.courts.find((c) => c.id === selectedCourt)?.name,
    //   date: date.toISOString().split("T")[0],
    //   timeSlots: selectedTimeSlots,
    //   timeRange: formatTimeRange(selectedTimeSlots),
    //   duration: selectedTimeSlots.length,
    // }

    // 결제 페이지로 이동
    // router.push(`/payment?data=${encodeURIComponent(JSON.stringify(reservationData))}`)
  }

  // 시설 평점
  const formatTime = (time: string | null) => {
    if(time) {
      return time.replace(/^(\d{2}:\d{2}):\d{2}$/, "$1");
    }
  }

  const goReviewLsit = async () => {
    sessionStorage.removeItem("facility-review-list");
    await Promise.resolve();
    router.push(`/facilities/${facilityDetail?.facilityId}/reviews`);
  }

  // 시간 파싱
  const parseHour = (time: string) => {
    return parseInt(time.split(":")[0], 10);
  }

  // 시 표시용 포맷 변환
  const formatDisplay = (time: string) => {
    return time.slice(0, 5); // -> 00:00
  }

  if(facilityDetail)
  return (
    <div className="w-full bg-background py-6 md:py-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 시설 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image src={facilityDetail.imageUrl ? API_BASE_URL.slice(0, -1) + facilityDetail.imageUrl : "https://images.unsplash.com/photo-1626224583764-f88b815bad2a?q=80&w=1024"} alt={facilityDetail.facilityName} fill className="object-cover" />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{facilityDetail.facilityName}</h1>
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium mr-2">{facilityDetail.rating.toFixed(1)}</span>
                <span className="text-gray-500">| {displaySportName(facilityDetail.sportType)}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{facilityDetail.address}</span>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{facilityDetail.managerPhoneNumber}</span>
                </div>
                <div className="flex flex-col items-start">
                  <div
                    className="flex items-start cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                  >
                    <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <span>운영시간</span>
                    {expanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 mt-[2px] ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 mt-[2px] ml-1" />
                    )}
                  </div>

                  {expanded && (
                    <ul className="ml-7 mt-1 text-gray-700">
                      {facilityDetail.hours.map((hour, idx) => (
                        <li key={idx}>
                          {displayDayOfWeek(hour.dayOfWeek)}: {formatTime(hour.openTime)} ~ {formatTime(hour.closeTime)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="info">시설 정보</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="p-4">
                <h3 className="text-lg font-semibold mb-2">시설 정보</h3>
                <p className="mb-4">{facilityDetail.description ?? "시설에 대한 설명이 아직 등록되지 않았습니다."}</p>

                <h4 className="font-medium mb-2">코트 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilityDetail.courts.map((court) => (
                    <Card key={court.id}>
                      <CardContent className="p-4">
                        <h5 className="font-medium">{court.name}</h5>
                        <p className="text-sm text-gray-500">
                          {court.indoor ? "실내" : "실외"} | {court.courtType} | {court.fee.toLocaleString()}원
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* 리뷰 섹션 */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">리뷰</h3>
                <button onClick={() => goReviewLsit()}>
                  <Button variant="outline" size="sm">
                    리뷰 더보기
                  </Button>
                </button>
              </div>
              <div className="space-y-3">
                {facilityDetail.reviews.length > 0 ? facilityDetail.reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">{review.title}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.content}</p>
                  </div>
                )) : (
                  <p className="text-center">아직 등록된 리뷰가 없습니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* 예약 폼 */}
          <div className="lg:sticky lg:top-4 self-start">
            <Card className="styled-card overflow-hidden shadow-lg bg-white border-0 rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">예약하기</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">코트 선택</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {facilityDetail.courts
                      .filter((court) => court.id === parseInt(params.id))
                      .map((court) => (
                        <Button
                          key={court.id}
                          type="button"
                          //onClick={() => setSelectedCourt(court.id)}
                          className={`justify-start h-10 text-sm border bg-white hover:bg-gray-50 text-gray-800 border-gray-200`}
                        >
                          {court.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">날짜 선택</h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="mx-auto"
                        disabled={(date) => {
                          const now = new Date()
                          now.setHours(0, 0, 0, 0)
                          return date < now
                        }}
                        classNames={{
                          months: "flex flex-col",
                          month: "space-y-0",
                          caption: "flex justify-center py-3 relative items-center",
                          caption_label: "text-base font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-9 w-9 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-full flex items-center justify-center",
                          nav_button_previous: "absolute left-2",
                          nav_button_next: "absolute right-2",
                          table: "w-full border-collapse",
                          head_row: "grid grid-cols-7",
                          head_cell: "text-gray-500 font-medium text-sm text-center py-2 [&:nth-child(1)]:text-red-500 [&:nth-child(7)]:text-blue-500",
                          row: "grid grid-cols-7",
                          cell: "text-center relative py-1",
                          day: "h-8 w-8 p-0 mx-auto font-normal text-sm flex items-center justify-center rounded-full hover:bg-gray-100",
                          day_range_end: "bg-indigo-600 text-white",
                          day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-600 focus:text-white rounded-full font-medium",
                          day_today: "bg-gray-100 text-gray-900 font-medium",
                          day_outside: "text-gray-300 opacity-50",
                          day_disabled: "text-gray-300 opacity-50",
                          day_range_middle: "bg-gray-100",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">시간 선택</h3>
                    {selectedTimeSlots.length > 0 && (
                      <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-indigo-700">
                            선택된 시간: {formatTimeRange(selectedTimeSlots)}
                          </span>
                          <span className="text-xs text-indigo-600">
                            {selectedTimeSlots.length}시간
                          </span>
                        </div>
                        <p className="text-xs text-indigo-600 mt-1">
                          연속된 시간대를 최대 3시간까지 선택할 수 있습니다.
                        </p>
                      </div>
                    )}
                    {timeSlot.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
                        {timeSlot.map((slot, index) => {
                          
                          const hour = parseHour(slot);
                          const display = formatDisplay(slot);

                          return (
                          <Button
                            key={index}
                            type="button"
                            onClick={() => handleTimeSlotClick(hour)}
                            className={`justify-center h-12 text-sm border ${
                              selectedTimeSlots.includes(hour) 
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent" 
                                : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                            } rounded-xl px-3 py-2 w-full transition-colors`}
                          >
                            {display}
                          </Button>
                        )})}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-4 border rounded-xl bg-gray-50">선택한 날짜에 예약 가능한 시간이 없습니다.</p>
                    )}
                  </div>

                  <Button
                    onClick={handleReservation}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl mt-6"
                    disabled={!selectedCourt || selectedTimeSlots.length === 0 || !date}
                  >
                    {selectedTimeSlots.length > 0 
                      ? `${selectedTimeSlots.length}시간 예약하기` 
                      : '예약하기'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

