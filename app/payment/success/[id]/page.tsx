'use client';

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PaymentResultResponse } from "@/lib/types/payment";

export default function PaymentSuccessPage({params} : {params: {id: number}}) {

  const [paymentInfo, setPaymentInfo] = useState<PaymentResultResponse | null>(null);
  const queryParam = useSearchParams();
  const router = useRouter();
  const ref = useRef(false);

  const orderId = String(queryParam.get("orderId"));

  useEffect(() => {
    if(ref.current) return;
      ref.current = true;

    const result = localStorage.getItem("paymentResult");

    if( !result ) {
      router.push("/");
      return;
    }

    const resultData = JSON.parse(result);
    
    setPaymentInfo(resultData);

  }, []);

  if(!paymentInfo) return false;
  if(paymentInfo.status !== 'success') return false;

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md styled-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">신청 완료</CardTitle>
          <CardDescription>신청이 성공적으로 완료되었습니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-center text-foreground font-medium mb-4">
            {paymentInfo.type === 'matchPaymentSuccess' ? "매치 신청이 성공적으로 완료되었습니다!" : "예약이 성공적으로 완료되었습니다!"}
          </p>
          <div className="w-full bg-secondary p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">신청 번호</span>
              <span className="text-sm font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">예약 시설</span>
              {
                (paymentInfo.type === 'matchPaymentSuccess' )&& (
                  <span className="text-sm font-medium">{paymentInfo.facilityCourt}</span>
                )
              }

              {
                (paymentInfo.type === 'reservePaymentSuccess' )&& (
                  <span className="text-sm font-medium">{`${paymentInfo.facilityName}/${paymentInfo.courtName}`}</span>
                )
              }
              
            </div>
            {
              (paymentInfo.type !== 'matchPaymentSuccess') ?  // 예약결제인 경우
              (<>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">예약 날짜</span>
                  <span className="text-sm font-medium">2024.06.15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">예약 시간</span>
                  <span className="text-sm font-medium">{`${paymentInfo.startTime}-${paymentInfo.endTime}`}</span>
                </div>
              </>
              ) : ( // 매치 결제인 경우
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">매치 날짜</span>
                    <span className="text-sm font-medium">{paymentInfo.matchDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">매치 시간</span>
                    <span className="text-sm font-medium">{`${paymentInfo.matchTime}:00-${paymentInfo.matchEndTime}:00`}</span>
                  </div>
                </>
              )
            }
            
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pb-6">
          <Button asChild className="w-full">
            {
              (paymentInfo.type === 'matchPaymentSuccess') ? 
              <Link href={`/matches/${params.id}`}>매치 확인하기</Link> : 
              <Link href={`/facilities/${params.id}`}>내 예약 확인하기</Link>
            }
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 