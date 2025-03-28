"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Clock, CreditCard, User, ArrowLeft, Receipt, LogIn } from "lucide-react"
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
  players?: number
  bookedBy?: string
  bookingNumber?: string
  paymentMethod?: string
  cancellationPolicy?: string
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
    players: 2,
    bookedBy: "홍길동",
    bookingNumber: "T-20250328-001",
    paymentMethod: "신용카드",
    cancellationPolicy: "예약 시작 24시간 이전 취소 시 전액 환불, 이후 취소 시 환불 불가"
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
    players: 10,
    bookedBy: "김철수",
    bookingNumber: "F-20250329-002",
    paymentMethod: "계좌이체",
    cancellationPolicy: "예약 시작 48시간 이전 취소 시 전액 환불, 이후 취소 시 50% 환불"
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
    players: 10,
    bookedBy: "이영희",
    bookingNumber: "B-20250315-003",
    paymentMethod: "카카오페이",
    cancellationPolicy: "예약 시작 24시간 이전 취소 시 전액 환불, 이후 취소 시 환불 불가"
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
    players: 4,
    bookedBy: "박지민",
    bookingNumber: "BD-20250310-004",
    paymentMethod: "네이버페이",
    cancellationPolicy: "예약 시작 12시간 이전 취소 시 전액 환불, 이후 취소 시 환불 불가"
  },
]

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 로그인 상태 확인
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  // 테스트용 로그인 처리
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
    router.refresh()
  }

  useEffect(() => {
    // 실제 구현에서는 API 호출을 통해 예약 정보를 가져옴
    const fetchReservation = () => {
      if (!isLoggedIn) return // 로그인 상태가 아니면 API 호출 하지 않음
      
      setIsLoading(true)
      try {
        // API 호출 시뮬레이션
        setTimeout(() => {
          const foundReservation = dummyReservations.find(r => r.id === id)
          if (foundReservation) {
            setReservation(foundReservation)
          }
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching reservation:", error)
        setIsLoading(false)
      }
    }

    fetchReservation()
  }, [id, isLoggedIn])

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
  const handleCancelReservation = () => {
    // 실제 구현에서는 API 호출을 통해 예약을 취소
    if (reservation) {
      setReservation({
        ...reservation,
        status: "취소",
        paymentStatus: "환불"
      })
    }
    setShowCancelDialog(false)
  }

  // 로그인이 필요한 경우 안내 메시지 표시
  if (!isLoggedIn) {
    return (
      <div className="container py-8">
        <Card className="styled-card mb-8">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <LogIn className="h-16 w-16 text-indigo-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">예약 상세 정보를 확인하려면 로그인이 필요합니다.</p>
            
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

  // 로딩 중이거나 예약 정보를 찾지 못한 경우
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <Link href="/reservations" className="text-indigo-600 hover:text-indigo-800 font-medium">
            예약 목록으로 돌아가기
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 flex justify-center items-center">
            <p className="text-gray-500">예약 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reservation) {
    return notFound()
  }

  const canCancel = reservation.status !== "취소" && reservation.status !== "완료"

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <Link href="/reservations" className="text-indigo-600 hover:text-indigo-800 font-medium">
          예약 목록으로 돌아가기
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">예약 상세 정보</CardTitle>
                <Badge
                  className={`
                    ${reservation.status === "확정" ? "bg-green-100 text-green-800 border-green-200" : ""}
                    ${reservation.status === "대기중" ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                    ${reservation.status === "완료" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : ""}
                    ${reservation.status === "취소" ? "bg-gray-100 text-gray-600 border-gray-200" : ""}
                  `}
                >
                  {reservation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{reservation.facilityName}</h3>
                <p className="text-indigo-600 mb-1">{reservation.courtName} | {reservation.sportType}</p>
                <div className="flex items-center mb-1">
                  <MapPin className="h-4 w-4 text-indigo-400 mr-2" />
                  <span className="text-gray-600">{reservation.address}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">예약 일시</h4>
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>{formatDate(reservation.reservationDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>{reservation.timeSlot}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">예약 정보</h4>
                  <div className="flex items-center mb-1">
                    <User className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>예약자: {reservation.bookedBy}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <Receipt className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>예약 번호: {reservation.bookingNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>인원: {reservation.players}명</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">결제 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <CreditCard className="h-4 w-4 text-indigo-400 mr-2" />
                      <span>결제 금액: {reservation.totalPrice}</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-indigo-400 mr-2" />
                      <span>결제 방법: {reservation.paymentMethod}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <Badge
                        className={`
                          ${reservation.paymentStatus === "결제 완료" ? "bg-green-100 text-green-800 border-green-200" : ""}
                          ${reservation.paymentStatus === "결제 대기" ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                          ${reservation.paymentStatus === "환불" ? "bg-gray-100 text-gray-600 border-gray-200" : ""}
                        `}
                      >
                        {reservation.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">취소 정책</h4>
                <p className="text-gray-600 text-sm">{reservation.cancellationPolicy}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">예약 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canCancel && (
                <Button 
                  variant="destructive" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => setShowCancelDialog(true)}
                >
                  예약 취소
                </Button>
              )}
              
              <Button asChild variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                <Link href={`/facilities/${reservation.id}`}>시설 정보 보기</Link>
              </Button>
              
              {reservation.status === "완료" && (
                <Button 
                  asChild 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Link href={`/facilities/${reservation.id}/review`}>리뷰 작성</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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