"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"

interface PaymentFail {
  type: string;
  id: number;
  errorCode: string;
  message: string;
}

export default function PaymentFailedPage() {

  const [ paymentFail, setPaymentFail ] = useState<PaymentFail | null>(null);

  // 실패 사유
  useEffect(() => {

    const payFail = localStorage.getItem("paymentFail");

    if(!payFail) return;

    console.log(payFail);

    setPaymentFail(JSON.parse(payFail));

  }, []);

  if(!paymentFail) return null;

  // 매치 또는 시설 예약에 따른 경로
  const getReturnPath = (): string => {
    let returnPath = "";

    if(paymentFail.type === 'match'){
      returnPath = `/matches/${paymentFail.id}`;
    }else{
      returnPath = `/reservations/${paymentFail.id}`;
    }

    return returnPath;
  }

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md styled-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">결제 실패</CardTitle>
          <CardDescription>결제 과정에서 문제가 발생했습니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-center text-foreground font-medium mb-2">
            결제가 완료되지 않았습니다.
          </p>
          <p className="text-center text-sm text-muted-foreground mb-6">
            다음과 같은 이유로 결제가 실패했을 수 있습니다:
          </p>
          
          <ul className="w-full bg-secondary p-4 rounded-lg mb-6 space-y-2">
            <li className="text-sm flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>{paymentFail.message}</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pb-6">
          <Button asChild className="w-full">
            <Link href={getReturnPath()}>다시 시도하기</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            문제가 계속되면 고객센터 (1234-5678)로 문의해주세요.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 