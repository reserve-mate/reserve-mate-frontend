'use client';

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PaymentResultResponse } from "@/lib/types/payment";
import { Suspense } from "react";

// Client Component that uses useSearchParams
function PaymentCancel({params} : {params: {id: number}}) {
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
          <CardTitle className="text-2xl font-bold">결제 완료</CardTitle>
          <CardDescription>결제가 성공적으로 완료되었습니다.</CardDescription>
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
              <span className="text-sm text-muted-foreground">예약 번호</span>
              <span className="text-sm font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">예약 시설</span>
              {
                (paymentInfo.type === 'matchPaymentSuccess' || paymentInfo.type === 'reservePayment') && (
                  <span className="text-sm font-medium">{paymentInfo.facilityCourt}</span>
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
                  <span className="text-sm font-medium">14:00-16:00</span>
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

// Loading component for Suspense fallback
function PaymentCancelLoading() {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md styled-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">결제 정보 로딩 중</CardTitle>
          <CardDescription>잠시만 기다려주세요.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="h-16 w-16 animate-pulse rounded-full bg-muted mb-6"></div>
          <div className="w-full h-4 animate-pulse rounded bg-muted mb-4"></div>
          <div className="w-3/4 h-4 animate-pulse rounded bg-muted"></div>
        </CardContent>
      </Card>
    </div>
  );
}

// Page component with Suspense boundary
export default function PaymentSuccessPage({params} : {params: {id: number}}) {
  return (
    <Suspense fallback={<PaymentCancelLoading />}>
      <PaymentCancel params={params} />
    </Suspense>
  )
} 