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
import { reservationService } from "@/lib/services/reservationService"
import { displayReservationStatus, ReservationDetail } from "@/lib/types/reservationType"
import { ReservationStatus } from "@/lib/enum/reservationEnum"
import { displaySportName } from "@/lib/types/matchTypes"
import { PaymentStatus } from "@/lib/enum/paymentEnum"
import { displayPaymentStatus } from "@/lib/types/payment"
import { toast } from "@/hooks/use-toast"

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [reservationDetail, setreservationDetail] = useState<ReservationDetail | null>(null);

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
    const fetchReservation = async () => {
      if (!isLoggedIn) return // 로그인 상태가 아니면 API 호출 하지 않음
      
      setIsLoading(true)
      try {
        // API 호출 시뮬레이션
        const response = await reservationService.getReservationDetail(parseInt(id));
        if(!response) {
          return;
        }
        setreservationDetail(response);
      } catch (error: any) {
        console.error("Error fetching reservation:", error)
        toast({
          title: "조회 실패",
          description: (error.message) ? (error.message) : "결제 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        setIsLoading(false);
      }finally {
        setIsLoading(false);
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
    setShowCancelDialog(false)
  }

  // 에약결제로 이동
  const reservePayment = () => {
    router.push(`/payment?reservationId=${parseInt(id)}`);
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

  if(!reservationDetail) {
    router.push('/reservations');
    return;
  }

  // 예약 취소 페이지 이동
  const handleCancel = () => {
    if(reservationDetail.reservationStatus === ReservationStatus.CANCELED || reservationDetail.reservationStatus === ReservationStatus.COMPLETED) {
      toast({
        title: "예약 취소 실패",
        description: "이미 완료되었거나 취소된 예약입니다.",
        variant: "destructive",
      });
    }

    router.push(`/reservations/cancel/${reservationDetail.reservationId}?status=${reservationDetail.reservationStatus}`);
  }

  const canCancel = reservationDetail.reservationStatus !== ReservationStatus.CANCELED && reservationDetail.reservationStatus !== ReservationStatus.COMPLETED;

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
                    ${reservationDetail.reservationStatus === ReservationStatus.CONFIRMED ? "bg-green-100 text-green-800 border-green-200" : ""}
                    ${reservationDetail.reservationStatus === ReservationStatus.PENDING ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                    ${reservationDetail.reservationStatus === ReservationStatus.COMPLETED ? "bg-indigo-100 text-indigo-800 border-indigo-200" : ""}
                    ${reservationDetail.reservationStatus === ReservationStatus.CANCELED ? "bg-gray-100 text-gray-600 border-gray-200" : ""}
                  `}
                >
                  {displayReservationStatus(reservationDetail.reservationStatus)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{reservationDetail.facilityName}</h3>
                <p className="text-indigo-600 mb-1">{reservationDetail.courtName} | {displaySportName(reservationDetail.sportType)}</p>
                <div className="flex items-center mb-1">
                  <MapPin className="h-4 w-4 text-indigo-400 mr-2" />
                  <span className="text-gray-600">{reservationDetail.address}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">예약 일시</h4>
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>{formatDate(reservationDetail.reservationDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>{`${reservationDetail.startTime}-${reservationDetail.endTime}`}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">예약 정보</h4>
                  <div className="flex items-center mb-1">
                    <User className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>예약자: {reservationDetail.bookedName}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <Receipt className="h-4 w-4 text-indigo-400 mr-2" />
                    <span>예약 번호: {reservationDetail.reservationNumber}</span>
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
                      <span>결제 금액: {reservationDetail.totalPrice.toLocaleString()}원</span>
                    </div>

                    {(reservationDetail.reservationStatus !== ReservationStatus.PENDING && reservationDetail.paymentStatus === PaymentStatus.PAID)
                    && 
                    (
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-indigo-400 mr-2" />
                        <span>결제 방법: {reservationDetail.paymentMethod}</span>
                      </div>
                    )}

                    {
                      (reservationDetail.reservationStatus === ReservationStatus.CANCELED) && 
                      (
                        <>
                          {(reservationDetail.refundPayment) && (
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 text-indigo-400 mr-2" />
                              <span>취소 금액: {reservationDetail.refundPayment.toLocaleString()}원</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-indigo-400 mr-2" />
                            <span>취소 사유: {reservationDetail.cancelReason}</span>
                          </div>
                        </>
                      )
                    }
                    
                  </div>
                  <div>
                    <div className="flex items-center">
                      <Badge
                        className={`
                          ${reservationDetail.paymentStatus === PaymentStatus.PAID ? "bg-green-100 text-green-800 border-green-200" : ""}
                          ${(reservationDetail.reservationStatus === ReservationStatus.PENDING) ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                          ${(reservationDetail.reservationStatus === ReservationStatus.CANCELED || reservationDetail.paymentStatus === PaymentStatus.PARTIAL_CANCELED) ? "bg-gray-100 text-gray-600 border-gray-200" : ""}
                        `}
                      >
                        { (reservationDetail.reservationStatus === ReservationStatus.CANCELED) ? 
                          "결제취소" : (displayPaymentStatus(reservationDetail.paymentStatus))
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">취소 정책</h4>
                <p className="text-gray-600 text-sm">
                  • 예약 시작 48시간 전까지 취소: 전액 환불<br/>
                  • 예약 시작 24시간 ~ 48시간 전 사이 취소: 50% 환불<br/>
                  • 예약 시작 24시간 이내 취소: 환불 불가<br/>
                  </p>
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

              {(reservationDetail.reservationStatus === ReservationStatus.PENDING) && (
                <Button 
                  variant="destructive" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => reservePayment()}
                >
                  예약 결제
                </Button>
              )}

              {canCancel && (
                <Button 
                  variant="destructive" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleCancel}
                >
                  예약 취소
                </Button>
              )}
              
              <Button asChild variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                <Link href={`/facilities/${reservationDetail.facilityId}`}>시설 정보 보기</Link>
              </Button>
              
              {reservationDetail.reservationStatus === ReservationStatus.COMPLETED && (
                <Button 
                  asChild 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Link href={`/facilities/${reservationDetail.reservationId}/review`}>리뷰 작성</Link>
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