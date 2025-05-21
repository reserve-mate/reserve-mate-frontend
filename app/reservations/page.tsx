"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, CreditCard, LogIn } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    facilityName: "서울 테니스 센터1",
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
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])
  
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString())
  }, [isLoggedIn])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

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

  // 예약 취소 모달 표시
  const openCancelDialog = (id: string) => {
    setSelectedReservationId(id)
    setShowCancelDialog(true)
  }

  // 예약 취소 처리
  const handleCancelReservation = () => {
    if (!selectedReservationId) return
    
    // 실제 구현에서는 API 호출을 통해 예약을 취소합니다
    setReservations(
      reservations.map((reservation) =>
        reservation.id === selectedReservationId
          ? { ...reservation, status: "취소" as const, paymentStatus: "환불" as const }
          : reservation,
      ),
    )
    
    setShowCancelDialog(false)
    setSelectedReservationId(null)
  }

  // 상태별 예약 필터링
  const upcomingReservations = reservations.filter((r) => r.status === "확정" || r.status === "대기중")
  const pastReservations = reservations.filter((r) => r.status === "완료" || r.status === "취소")

  if (!isLoggedIn) {
    return (
      <div className="container py-8">
        <Card className="styled-card mb-8">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <LogIn className="h-16 w-16 text-indigo-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">예약 내역을 확인하려면 로그인이 필요합니다.</p>
            
            <div className="flex gap-3">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleLogin}
              >
                로그인 테스트
              </Button>
              <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8">내 예약</h1>

      <Card className="styled-card mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">예정된 예약</TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">지난 예약</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingReservations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">예정된 예약이 없습니다.</p>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link href="/facilities">시설 찾아보기</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation) => (
                    <Card key={reservation.id} className="border border-indigo-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{reservation.facilityName}</h3>
                              <Badge
                                className={`
                                  ${reservation.status === "확정" ? "bg-green-100 text-green-800 border-green-200" : ""}
                                  ${reservation.status === "대기중" ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                                `}
                              >
                                {reservation.status}
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-500">
                              {reservation.courtName} | {reservation.sportType}
                            </div>

                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{reservation.address}</span>
                            </div>

                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{formatDate(reservation.reservationDate)}</span>
                            </div>

                            <div className="flex items-start">
                              <Clock className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{reservation.timeSlot}</span>
                            </div>

                            <div className="flex items-start">
                              <CreditCard className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">
                                {reservation.totalPrice} | {reservation.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:min-w-[120px]">
                            <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                              <Link href={`/reservations/${reservation.id}`}>상세 보기</Link>
                            </Button>

                            {reservation.status !== "취소" && (
                              <Button 
                                variant="destructive" 
                                className="bg-red-600 hover:bg-red-700" 
                                onClick={() => openCancelDialog(reservation.id)}
                              >
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
                    <Card key={reservation.id} className="border border-indigo-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{reservation.facilityName}</h3>
                              <Badge
                                className={`
                                  ${reservation.status === "완료" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : ""}
                                  ${reservation.status === "취소" ? "bg-gray-100 text-gray-600 border-gray-200" : ""}
                                `}
                              >
                                {reservation.status}
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-500">
                              {reservation.courtName} | {reservation.sportType}
                            </div>

                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{reservation.address}</span>
                            </div>

                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{formatDate(reservation.reservationDate)}</span>
                            </div>

                            <div className="flex items-start">
                              <Clock className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{reservation.timeSlot}</span>
                            </div>

                            <div className="flex items-start">
                              <CreditCard className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">
                                {reservation.totalPrice} | {reservation.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:min-w-[120px]">
                            <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                              <Link href={`/reservations/${reservation.id}`}>상세 보기</Link>
                            </Button>

                            {reservation.status === "완료" && (
                              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
        </CardContent>
      </Card>

      {/* 예약 취소 확인 모달 */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-indigo-700">예약 취소 확인</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              정말로 이 예약을 취소하시겠습니까? 취소 시 환불 규정에 따라 처리됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
              취소
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelReservation}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              예약 취소
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

