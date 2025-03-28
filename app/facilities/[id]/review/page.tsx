"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft, Building, LogIn } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// 시설 정보 타입
type Facility = {
  id: string
  name: string
  type: string
  reservationId: string
  reservationDate: string
}

// 더미 시설 정보
const dummyFacilities: Record<string, Facility> = {
  "1": {
    id: "1",
    name: "서울 테니스 센터",
    type: "테니스",
    reservationId: "T-20250328-001",
    reservationDate: "2025년 3월 28일",
  },
  "2": {
    id: "2",
    name: "강남 풋살장",
    type: "풋살",
    reservationId: "F-20250329-002",
    reservationDate: "2025년 3월 29일",
  },
  "3": {
    id: "3",
    name: "종로 농구코트",
    type: "농구",
    reservationId: "B-20250315-003",
    reservationDate: "2025년 3월 15일",
  },
  "4": {
    id: "4",
    name: "한강 배드민턴장",
    type: "배드민턴",
    reservationId: "BD-20250310-004",
    reservationDate: "2025년 3월 10일",
  },
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [facility, setFacility] = useState<Facility | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 리뷰 데이터
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: "",
    content: "",
  })

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
    // 실제 구현에서는 API 호출을 통해 시설 정보를 가져옴
    const fetchFacility = () => {
      if (!isLoggedIn) return // 로그인 상태가 아니면 API 호출 하지 않음
      
      setIsLoading(true)
      try {
        // API 호출 시뮬레이션
        setTimeout(() => {
          const foundFacility = dummyFacilities[id as string]
          if (foundFacility) {
            setFacility(foundFacility)
          }
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching facility:", error)
        setIsLoading(false)
      }
    }

    fetchFacility()
  }, [id, isLoggedIn])

  // 리뷰 입력 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setReviewData((prev) => ({ ...prev, [name]: value }))
  }

  // 별점 변경 처리
  const handleRatingChange = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }))
  }

  // 리뷰 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (reviewData.rating === 0) {
      toast({
        title: "별점을 선택해주세요",
        description: "리뷰를 작성하기 위해서는 별점이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    if (!reviewData.title.trim()) {
      toast({
        title: "제목을 입력해주세요",
        description: "리뷰 제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!reviewData.content.trim()) {
      toast({
        title: "내용을 입력해주세요",
        description: "리뷰 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출을 통해 리뷰를 저장
      // 여기서는 제출 성공 시뮬레이션
      setTimeout(() => {
        toast({
          title: "리뷰가 등록되었습니다",
          description: "소중한 의견을 공유해주셔서 감사합니다.",
        })
        router.push("/reservations")
      }, 1000)
    } catch (error) {
      toast({
        title: "리뷰 등록 실패",
        description: "리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // 로그인이 필요한 경우 안내 메시지 표시
  if (!isLoggedIn) {
    return (
      <div className="container py-8">
        <Card className="styled-card mb-8">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <LogIn className="h-16 w-16 text-indigo-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">리뷰를 작성하려면 로그인이 필요합니다.</p>
            
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

  // 로딩 중이거나 시설 정보를 찾지 못한 경우
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
            <p className="text-gray-500">시설 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!facility) {
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
            <p className="text-gray-500">시설 정보를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <Link href="/reservations" className="text-indigo-600 hover:text-indigo-800 font-medium">
          예약 목록으로 돌아가기
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">리뷰 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Building className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-lg font-semibold">{facility.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">
              {facility.type} | 예약번호: {facility.reservationId} | 이용일: {facility.reservationDate}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center">
                  <Label htmlFor="rating" className="text-sm font-medium mr-3">
                    별점
                  </Label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => handleRatingChange(star)}
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= reviewData.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {reviewData.rating > 0
                    ? `${reviewData.rating}점을 선택하셨습니다`
                    : "별점을 선택해주세요"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  제목
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="리뷰 제목을 입력해주세요"
                  value={reviewData.title}
                  onChange={handleInputChange}
                  className="border-indigo-200 focus:border-indigo-300 focus:ring-indigo-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  내용
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="시설 이용 경험을 자세히 공유해주세요"
                  rows={6}
                  value={reviewData.content}
                  onChange={handleInputChange}
                  className="resize-none border-indigo-200 focus:border-indigo-300 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                onClick={() => router.push("/reservations")}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "제출 중..." : "리뷰 등록하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 