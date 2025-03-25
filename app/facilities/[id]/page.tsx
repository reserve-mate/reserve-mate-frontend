"use client"

import { useState } from "react"
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

// 시간 슬롯 생성 함수
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 6; hour < 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`)
  }
  return slots
}

export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const timeSlots = generateTimeSlots()

  // 실제 구현에서는 API를 통해 시설 정보를 가져옵니다
  const facility = dummyFacility

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
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">예약하기</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">코트 선택</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {facility.courts.map((court) => (
                      <Button
                        key={court.id}
                        variant={selectedCourt === court.id ? "default" : "outline"}
                        onClick={() => setSelectedCourt(court.id)}
                        className="justify-start"
                      >
                        {court.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">날짜 선택</h3>
                  <div className="border rounded-md p-2">
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
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">시간 선택</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTimeSlot === slot ? "default" : "outline"}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className="justify-start"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleReservation}
                  className="w-full"
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
  )
}

