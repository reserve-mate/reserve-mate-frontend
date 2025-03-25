"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, CreditCard } from "lucide-react"

// 예약 데이터 타입
type Reservation = {
  id: string
  facilityName: string
  courtName: string
  address: string
  sportType: string
  reservationDate: string
  timeSlot: string
  status: "대기중" | "확정" | "취소" | "완료"
  totalPrice: string
  paymentStatus: "결제 대기" | "결제 완료" | "환불"
}

// 더미 데이터
const dummyReservations: Reservation[] = [
  {
    id: "1",
    facilityName: "서울 테니스 센터",
    courtName: "코트 A",
    address: "서울시 강남구 테헤란로 123",
    sportType: "테니스",
    reservationDate: "2025-03-28",
    timeSlot: "18:00 - 20:00",
    status: "확정",
    totalPrice: "40,000원",
    paymentStatus: "결제 완료",
  },
  {
    id: "2",
    facilityName: "강남 풋살장",
    courtName: "실내 코트 1",
    address: "서울시 강남구 역삼동 456",
    sportType: "풋살",
    reservationDate: "2025-03-29",
    timeSlot: "19:00 - 21:00",
    status: "대기중",
    totalPrice: "60,000원",
    paymentStatus: "결제 대기",
  },
  {
    id: "3",
    facilityName: "종로 농구코트",
    courtName: "코트 B",
    address: "서울시 종로구 종로 789",
    sportType: "농구",
    reservationDate: "2025-03-15",
    timeSlot: "14:00 - 16:00",
    status: "완료",
    totalPrice: "30,000원",
    paymentStatus: "결제 완료",
  },
  {
    id: "4",
    facilityName: "한강 배드민턴장",
    courtName: "코트 2",
    address: "서울시 영등포구 여의도동 101",
    sportType: "배드민턴",
    reservationDate: "2025-03-10",
    timeSlot: "20:00 - 22:00",
    status: "취소",
    totalPrice: "20,000원",
    paymentStatus: "환불",
  },
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(dummyReservations)

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date)
  }

  // 예약 취소 처리
  const handleCancelReservation = (id: string) => {
    // 실제 구현에서는 API 호출을 통해 예약을 취소합니다
    setReservations(
      reservations.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "취소" as const, paymentStatus: "환불" as const }
          : reservation,
      ),
    )
  }

  // 상태별 예약 필터링
  const upcomingReservations = reservations.filter((r) => r.status === "확정" || r.status === "대기중")
  const pastReservations = reservations.filter((r) => r.status === "완료" || r.status === "취소")

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">내 예약</h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">예정된 예약</TabsTrigger>
          <TabsTrigger value="past">지난 예약</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">예정된 예약이 없습니다.</p>
              <Button asChild>
                <Link href="/facilities">시설 찾아보기</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{reservation.facilityName}</h3>
                          <Badge
                            className={`
                              ${reservation.status === "확정" ? "bg-green-100 text-green-800" : ""}
                              ${reservation.status === "대기중" ? "bg-yellow-100 text-yellow-800" : ""}
                            `}
                          >
                            {reservation.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-500">
                          {reservation.courtName} | {reservation.sportType}
                        </div>

                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">{reservation.address}</span>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">{formatDate(reservation.reservationDate)}</span>
                        </div>

                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">{reservation.timeSlot}</span>
                        </div>

                        <div className="flex items-start">
                          <CreditCard className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">
                            {reservation.totalPrice} | {reservation.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button asChild variant="outline">
                          <Link href={`/reservations/${reservation.id}`}>상세 보기</Link>
                        </Button>

                        {reservation.status !== "취소" && (
                          <Button variant="destructive" onClick={() => handleCancelReservation(reservation.id)}>
                            예약 취소
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">지난 예약이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{reservation.facilityName}</h3>
                          <Badge
                            className={`
                              ${reservation.status === "완료" ? "bg-blue-100 text-blue-800" : ""}
                              ${reservation.status === "취소" ? "bg-gray-100 text-gray-800" : ""}
                            `}
                          >
                            {reservation.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-500">
                          {reservation.courtName} | {reservation.sportType}
                        </div>

                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">{reservation.address}</span>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">{formatDate(reservation.reservationDate)}</span>
                        </div>

                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">{reservation.timeSlot}</span>
                        </div>

                        <div className="flex items-start">
                          <CreditCard className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-500">
                            {reservation.totalPrice} | {reservation.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button asChild variant="outline">
                          <Link href={`/reservations/${reservation.id}`}>상세 보기</Link>
                        </Button>

                        {reservation.status === "완료" && (
                          <Button asChild>
                            <Link href={`/facilities/${reservation.id}/review`}>리뷰 작성</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

