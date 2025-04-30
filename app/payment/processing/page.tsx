import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentProcessingPage() {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md styled-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">결제 진행 중</CardTitle>
          <CardDescription>결제가 진행되고 있습니다. 잠시만 기다려주세요.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
          <p className="text-center text-muted-foreground mb-2">
            결제 처리 중입니다. 이 페이지를 닫지 마세요.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            결제가 완료되면 자동으로 다음 페이지로 이동합니다.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <p className="text-xs text-muted-foreground text-center">
            결제가 오래 걸리는 경우 페이지를 새로고침하거나 고객센터에 문의해주세요.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 