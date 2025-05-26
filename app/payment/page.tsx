"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Calendar, CreditCard, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { reservationService } from "@/lib/services/reservationService"
import { ReservationDetail } from "@/lib/types/reservationType"

interface ReservationData {
  facilityId: string
  facilityName: string
  courtId: string
  courtName: string
  date: string
  timeSlots: number[]
  timeRange: string
  duration: number
}

// 가격 계산 함수 (임시)
const calculatePrice = (duration: number, date: string) => {
  const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6
  const basePrice = isWeekend ? 40000 : 20000 // 주말/평일 기본 가격
  return basePrice * duration
}

// Client component that uses useSearchParams
function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [reservationData, setReservationData] = useState<ReservationData | null>(null)
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getReservations = async(reservationId: number) => {

    try {
      const response = await reservationService.getReservationDetail(reservationId);
      setReservation(response);
    }catch(error: any) {
      console.log(error);
      router.push("/");
    }

  }

  useEffect(() => {
    //const data = searchParams.get('data')
    const reservationId = searchParams.get("reservationId");

    if(!reservationId) {
      return;
    }

    // 예약 확인
    getReservations(parseInt(reservationId));

  }, [searchParams, router])

  // 결제 기능
  const handlePayment = async () => {
    if (!reservation) return

    setIsProcessing(true)

    try {
      // 실제 결제 API 호출을 여기에 구현
      // 임시로 토스트 메시지만 표시
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 대기 (API 호출 시뮬레이션)

      toast({
        title: "예약 완료",
        description: `${timeSlot(reservation.startTime, reservation.endTime)} 시간대 예약이 완료되었습니다.`,
      })

      // 성공 페이지로 이동 (임시로 홈으로)
      router.push(`/reservations`)
    } catch (error) {
      toast({
        title: "결제 실패",
        description: "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!reservation) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">예약 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  // 시간 간격
  const timeDuration = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);
    return endHour - startHour;
  }

  // 타임 슬롯
  const timeSlot = (startTime: string, endTime: string): {start: string, end: string}[] => {
    const slots: {start: string, end: string}[] = [];

    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    for(let hour = startHour; hour < endHour; hour++) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;

      slots.push({start, end});
    }

    return slots;
  }

  // 시간 포맷 00:00:00 -> 00:00
  const timeFormat = (time: string) => {
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  }

  const totalPrice = reservation.totalPrice; //calculatePrice(reservationData.duration, reservationData.date)
  const formattedDate = format(new Date(reservation.reservationDate), 'yyyy년 M월 d일 (E)', { locale: ko })

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">예약 결제</h1>
        <p className="text-gray-600">예약 정보를 확인하고 결제를 진행해주세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 예약 정보 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                예약 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{reservation.facilityName}</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <span className="text-sm">{reservation.courtName}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="font-medium">예약 날짜</span>
                    <p className="text-gray-600">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="font-medium">예약 시간</span>
                    <p className="text-gray-600">{`${timeFormat(reservation.startTime)}-${timeFormat(reservation.endTime)}`}</p>
                    <div className="flex mt-2">
                      <Badge variant="secondary">
                        {timeDuration(reservation.startTime, reservation.endTime)}시간 이용
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">선택된 시간 슬롯</h4>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlot(reservation.startTime, reservation.endTime).map((hour) => (
                    <div
                      key={hour.start}
                      className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-center"
                    >
                      <span className="text-sm font-medium text-indigo-700">
                        {hour.start} - {hour.end}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 결제 정보 */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">기본 요금 ({timeDuration(reservation.startTime, reservation.endTime)}시간)</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">부가세</span>
                  <span>포함</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>총 결제 금액</span>
                <span className="text-indigo-600">{totalPrice.toLocaleString()}원</span>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-3">결제 수단</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      defaultChecked
                      className="mr-3"
                    />
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>신용카드</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    결제 진행 중...
                  </div>
                ) : (
                  `${totalPrice.toLocaleString()}원 결제하기`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                결제 시 <a href="#" className="text-indigo-600 underline">이용약관</a> 및 
                <a href="#" className="text-indigo-600 underline"> 개인정보처리방침</a>에 동의하게 됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Loading fallback component
function PaymentLoading() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    </div>
  )
}

// Page component with Suspense boundary
export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  )
} 