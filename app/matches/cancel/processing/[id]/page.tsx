"use client"

import { useEffect, useState } from "react"
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
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import { matchPlayerService } from "@/lib/services/matchplayerService"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function MatchCancelProcessingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refundId = searchParams.get("refundId")
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (!refundId) {
      setStatus('error')
      setErrorMessage("환불 정보를 찾을 수 없습니다.")
      return
    }

    // 취소 상태 확인
    const checkStatus = async () => {
      try {
        const result = await matchPlayerService.checkCancelStatus(refundId)
        
        if (result.status === 'completed') {
          setStatus('success')
        } else if (result.status === 'failed') {
          setStatus('error')
          setErrorMessage(result.message || "환불 처리 중 오류가 발생했습니다.")
        } else {
          // 아직 진행 중이면 3초 후 다시 확인
          setTimeout(checkStatus, 3000)
        }
      } catch (error) {
        console.error("환불 상태 확인 중 오류:", error)
        setStatus('error')
        setErrorMessage("환불 상태 확인 중 오류가 발생했습니다.")
      }
    }

    checkStatus()
  }, [refundId])

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">매치 취소 처리</CardTitle>
          <CardDescription>
            {status === 'loading' ? "취소 및 환불 처리 중입니다..." : 
             status === 'success' ? "취소가 완료되었습니다" : 
             "취소 처리 중 문제가 발생했습니다"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-6 pb-8">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
              <p className="text-center text-gray-700">
                매치 취소 및 결제 환불을 처리하고 있습니다.<br />
                잠시만 기다려주세요.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-green-100 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">취소 완료</h3>
              <p className="text-center text-gray-700 mb-4">
                매치 취소 및 환불 처리가 완료되었습니다.<br />
                환불은 결제사 정책에 따라 영업일 기준 3-5일 내에 처리됩니다.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-red-100 rounded-full">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>처리 중 오류가 발생했습니다</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
              <p className="text-center text-gray-700">
                고객센터(1234-5678)로 문의하시거나<br />
                다시 시도해주세요.
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-0 pb-6">
          {status !== 'loading' && (
            <Button
              onClick={() => router.push(`/matches/${params.id}`)}
              className="w-full"
            >
              매치 상세 페이지로 이동
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push('/matches')}
            className="w-full"
          >
            매치 목록으로 이동
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 