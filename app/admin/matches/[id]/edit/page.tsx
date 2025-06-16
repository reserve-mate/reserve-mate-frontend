"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { matchService } from "@/lib/services/matchService"
import { AdminMatchDetail } from "@/lib/types/matchTypes"
import EditMatchForm from "@/components/admin/match-edit-form"

export default function EditMatchPage({ params }: { params: { id: number } }) {
  const router = useRouter()
  const [match, setMatch] = useState<AdminMatchDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 매치 정보 조회
  useEffect(() => {
    const fetchMatchData = async () => {
      setIsLoading(true)
      try {
        const matchData = await matchService.getAdminMatch(params.id)
        setMatch(matchData)
      } catch (error: any) {
        console.error("매치 정보 로드 실패:", error)
        setError(error?.message || "매치 정보를 불러오는 중 오류가 발생했습니다.")
        toast({
          title: "매치 정보 로드 실패",
          description: error?.message || "매치 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatchData()
  }, [params.id])

  const handleEditComplete = () => {
    // 수정 완료 후 매치 상세 페이지로 이동
    router.push(`/admin/matches/${params.id}`)
    toast({
      title: "매치 수정 완료",
      description: "매치 정보가 성공적으로 수정되었습니다."
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">매치 수정</h1>
        </div>
      </div>

      {/* 매치 수정 폼 */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-500">매치 정보를 로드 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => router.back()} variant="outline">
                뒤로 가기
              </Button>
            </div>
          ) : match ? (
            <EditMatchForm 
              matchId={params.id} 
              initialData={match} 
              onComplete={handleEditComplete} 
            />
          ) : (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <p className="text-gray-500">매치 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => router.back()} variant="outline">
                뒤로 가기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 