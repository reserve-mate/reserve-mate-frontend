"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Phone, Clock, Star, Info } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// 시설 상세 데이터 타입
type FacilityDetail = {
  id: string
  name: string
  description: string
  address: string
  contactPhone: string
  sportType: string
  rating: number
  operatingHours: string
  priceRange: string
  imageUrl: string
  courts: Court[]
}

type Court = {
  id: string
  name: string
  sportType: string
  indoor: boolean
}

// 더미 데이터
const dummyFacility: FacilityDetail = {
  id: "1",
  name: "서울 테니스 센터",
  description: "최신 시설을 갖춘 실내외 테니스 코트입니다. 초보자부터 전문가까지 모두 이용 가능합니다.",
  address: "서울시 강남구 테헤란로 123",
  contactPhone: "02-123-4567",
  sportType: "테니스",
  rating: 4.5,
  operatingHours: "평일 06:00 - 22:00, 주말 08:00 - 20:00",
  priceRange: "20,000원 ~ 40,000원",
  imageUrl: "/placeholder.svg?height=400&width=800",
  courts: [
    { id: "c1", name: "코트 A", sportType: "테니스", indoor: true },
    { id: "c2", name: "코트 B", sportType: "테니스", indoor: true },
    { id: "c3", name: "코트 C", sportType: "테니스", indoor: false },
    { id: "c4", name: "코트 D", sportType: "테니스", indoor: false },
  ],
}

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
    slots.push(`${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`)
  }
  return slots
}

export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  // 실제 구현에서는 API를 통해 시설 정보를 가져옵니다
  const facility = dummyFacility
  
  // 날짜가 변경될 때 가능한 시간 슬롯 업데이트
  useEffect(() => {
    setTimeSlots(generateTimeSlots(date, facility.operatingHours))
    setSelectedTimeSlot(null) // 날짜가 변경되면 선택된 시간 초기화
  }, [date, facility.operatingHours])

  const handleReservation = () => {
    if (!selectedCourt || !selectedTimeSlot || !date) {
      toast({
        title: "예약 정보 부족",
        description: "코트, 날짜, 시간을 모두 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    // 예약 정보를 세션에 저장하거나 상태 관리 라이브러리에 저장
    const reservationData = {
      facilityId: facility.id,
      facilityName: facility.name,
      courtId: selectedCourt,
      courtName: facility.courts.find((c) => c.id === selectedCourt)?.name,
      date: date.toISOString().split("T")[0],
      timeSlot: selectedTimeSlot,
    }

    // 결제 페이지로 이동
    router.push(`/payment?data=${encodeURIComponent(JSON.stringify(reservationData))}`)
  }

  return (
    <div className="w-full bg-background py-6 md:py-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 시설 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image src={facility.imageUrl || "/placeholder.svg"} alt={facility.name} fill className="object-cover" />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium mr-2">{facility.rating}</span>
                <span className="text-gray-500">| {facility.sportType}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{facility.address}</span>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{facility.contactPhone}</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{facility.operatingHours}</span>
                </div>
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{facility.description}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">시설 정보</TabsTrigger>
                <TabsTrigger value="price">가격 정보</TabsTrigger>
                <TabsTrigger value="reviews">리뷰</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="p-4">
                <h3 className="text-lg font-semibold mb-2">시설 정보</h3>
                <p className="mb-4">{facility.description}</p>

                <h4 className="font-medium mb-2">코트 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facility.courts.map((court) => (
                    <Card key={court.id}>
                      <CardContent className="p-4">
                        <h5 className="font-medium">{court.name}</h5>
                        <p className="text-sm text-gray-500">
                          {court.indoor ? "실내" : "실외"} | {court.sportType}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="price" className="p-4">
                <h3 className="text-lg font-semibold mb-2">가격 정보</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">평일</h4>
                    <p className="text-sm text-gray-500">06:00 - 18:00: 20,000원/시간</p>
                    <p className="text-sm text-gray-500">18:00 - 22:00: 30,000원/시간</p>
                  </div>
                  <div>
                    <h4 className="font-medium">주말 및 공휴일</h4>
                    <p className="text-sm text-gray-500">08:00 - 20:00: 40,000원/시간</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-4">
                <h3 className="text-lg font-semibold mb-2">리뷰</h3>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">김철수</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">코트 상태가 좋고 직원분들이 친절해요. 다음에 또 이용할 예정입니다.</p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">이영희</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">시설이 깨끗하고 위치도 좋아요. 주차 공간도 넉넉해서 편리했습니다.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
                      {facility.courts.map((court) => (
                        <Button
                          key={court.id}
                          type="button"
                          onClick={() => setSelectedCourt(court.id)}
                          className={`justify-start h-10 text-sm border ${
                            selectedCourt === court.id 
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent" 
                              : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                          } rounded-lg px-4 py-2 w-full`}
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
                          head_cell: "text-gray-500 font-medium text-sm text-center py-2 first:text-red-500 last:text-blue-500",
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
                    {timeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`justify-center h-12 text-sm border ${
                              selectedTimeSlot === slot 
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent" 
                                : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                            } rounded-xl px-3 py-2 w-full`}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-4 border rounded-xl bg-gray-50">선택한 날짜에 예약 가능한 시간이 없습니다.</p>
                    )}
                  </div>

                  <Button
                    onClick={handleReservation}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl mt-6"
                    disabled={!selectedCourt || !selectedTimeSlot || !date}
                  >
                    예약하기
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

