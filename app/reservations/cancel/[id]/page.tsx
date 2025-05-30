"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { matchPlayerService } from "@/lib/services/matchplayerService"
import { toast } from "@/hooks/use-toast"
import { ReservationStatus } from "@/lib/enum/reservationEnum"
import { reservationService } from "@/lib/services/reservationService"

export default function MatchCancellationPage({ params }: { params: { id: number } }) {
  const router = useRouter()
  //const { toast } = useToast()
  const [selectedReason, setSelectedReason] = useState("")
  const [otherReason, setOtherReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)

  const queryString = useSearchParams(); 
  const status = queryString.get("status");

  const cancellationReasons = [
    "개인 사정으로 인해 참석이 어렵습니다.",
    "일정이 변경되어 예약을 취소합니다.",
    "팀원 부족 / 동행자 불참",
    "팀원 사정으로 일정 조율 실패",
    "시설 상태 불만족 (코트 상태, 장비 등)",
    "중복 예약을 해서 하나를 취소합니다.",
    "실수로 잘못된 날짜/시간에 예약했습니다.",
    "기타 (직접 입력)"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 유효성 검사
    if (!selectedReason) {
      setShowError(true)
      return
    }

    if(!status) {
      router.back();
      return;
    }

    setIsSubmitting(true)
    
    try {
      const reason = selectedReason === "기타 (직접 입력)" ? otherReason : selectedReason

      const response = await reservationService.cancelReservation({
          id: params.id,
          cancelReason: reason
        });

      toast({
        title: "취소 요청이 접수되었습니다",
        description: "잠시만 기다려주세요. 결제 취소를 진행합니다.",
      })

      if(status === ReservationStatus.PENDING) {  // 대기중
        router.push(`/reservations/${params.id}`);
      }else if(status === ReservationStatus.CONFIRMED) {  // 확정
        router.push(`/reservations/cancel/processing/${params.id}?reservationNumber=${response}`);
      }

    } catch (error: any) {
      let errorMsg = "예약 취소 처리 중 문제가 발생했습니다. 다시 시도해주세요.";
      if(error) {
        errorMsg = error.message;
      }
      toast({
        title: "예약 취소 실패",
        description: errorMsg,
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-1" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" /> 돌아가기
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">예약 취소하기</CardTitle>
          <CardDescription>
            예약 취소하기 위한 사유를 선택해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>취소 사유 필요</AlertTitle>
              <AlertDescription>
                예약 취소를 위해 사유를 선택해주세요.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">취소 사유 선택</h3>
                <RadioGroup 
                  value={selectedReason} 
                  onValueChange={(value) => {
                    setSelectedReason(value)
                    setShowError(false)
                  }}
                  className="space-y-3"
                >
                  {cancellationReasons.map((reason) => (
                    <div key={reason} className="flex items-start space-x-2">
                      <RadioGroupItem value={reason} id={reason} />
                      <Label htmlFor={reason} className="font-normal">{reason}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {selectedReason === "기타 (직접 입력)" && (
                <div className="pl-6 pt-2">
                  <Label htmlFor="other-reason" className="mb-2 block">기타 사유 입력</Label>
                  <Textarea
                    id="other-reason"
                    placeholder="취소 사유를 입력해주세요"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="resize-none"
                    rows={3}
                    required
                  />
                </div>
              )}
            </div>
            
            <div className="mt-8 space-y-2">
              <p className="text-sm text-gray-500">취소 정책 안내</p>
              <ul className="text-xs text-gray-500 space-y-1 list-disc pl-5">
                <li>예약 시작 24시간 전까지 취소 시 전액 환불됩니다.</li>
                <li>예약 시작 12시간 전까지 취소 시 50% 환불됩니다.</li>
                <li>그 이후에는 환불이 불가능합니다.</li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "예약 취소하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 