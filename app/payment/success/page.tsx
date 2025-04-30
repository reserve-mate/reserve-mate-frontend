import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentSuccessPage() {
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
            예약이 성공적으로 완료되었습니다!
          </p>
          <div className="w-full bg-secondary p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">예약 번호</span>
              <span className="text-sm font-medium">#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">예약 시설</span>
              <span className="text-sm font-medium">체육관 A</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">예약 날짜</span>
              <span className="text-sm font-medium">2024.06.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">예약 시간</span>
              <span className="text-sm font-medium">14:00-16:00</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pb-6">
          <Button asChild className="w-full">
            <Link href="/reservations">내 예약 확인하기</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 