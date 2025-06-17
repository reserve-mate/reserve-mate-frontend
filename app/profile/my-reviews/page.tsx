"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Star, Edit, Trash2, Building, Calendar, MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// 내 리뷰 데이터 타입
type MyReview = {
  id: string
  facilityId: string
  facilityName: string
  rating: number
  title: string
  content: string
  images: string[]
  createdAt: string
  updatedAt?: string
}

// 더미 데이터
const dummyMyReviews: MyReview[] = [
  {
    id: "1",
    facilityId: "1",
    facilityName: "서울 테니스 센터",
    rating: 4,
    title: "좋은 시설이에요",
    content: "코트 상태가 좋고 직원분들이 친절해요. 다음에 또 이용할 예정입니다. 시설이 깨끗하고 샤워실도 잘 되어있어서 만족스러웠습니다.",
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16"
  },
  {
    id: "2",
    facilityId: "2",
    facilityName: "강남 스포츠 클럽",
    rating: 5,
    title: "최고의 테니스장!",
    content: "시설이 깨끗하고 위치도 좋아요. 주차 공간도 넉넉해서 편리했습니다. 코트 바닥 상태도 좋고 조명도 밝아서 야간 경기하기에도 좋습니다.",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    facilityId: "3",
    facilityName: "올림픽 공원 배드민턴장",
    rating: 3,
    title: "평범한 시설",
    content: "가격 대비 괜찮은 편이지만 아쉬운 부분들이 있어요. 전체적으로는 만족스럽습니다.",
    images: [],
    createdAt: "2024-01-05"
  },
  {
    id: "4",
    facilityId: "1",
    facilityName: "서울 테니스 센터",
    rating: 5,
    title: "두 번째 이용 후기",
    content: "이번에도 역시 좋았습니다. 예약 시스템이 편리하고 시설 관리도 잘 되어있어요.",
    images: ["/placeholder.jpg"],
    createdAt: "2024-01-01"
  }
]

export default function MyReviewsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [reviews, setReviews] = useState<MyReview[]>([])

  // 로그인 상태 확인
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    // 실제 구현에서는 API 호출
    const fetchMyReviews = async () => {
      setIsLoading(true)
      try {
        // API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500))
        setReviews(dummyMyReviews)
      } catch (error) {
        console.error("리뷰 로딩 실패:", error)
        toast({
          title: "오류 발생",
          description: "리뷰를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyReviews()
  }, [isLoggedIn])

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ))
  }

  const handleEditReview = (reviewId: string, facilityId: string) => {
    // 리뷰 수정 페이지로 이동
    router.push(`/facilities/${facilityId}/review?edit=${reviewId}`)
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      // 실제 구현에서는 API 호출
      // await deleteReview(reviewId)
      
      setReviews(reviews.filter(review => review.id !== reviewId))
      toast({
        title: "리뷰 삭제 완료",
        description: "리뷰가 성공적으로 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "리뷰 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 시설별로 리뷰 그룹화
  const groupedReviews = reviews.reduce((acc, review) => {
    if (!acc[review.facilityId]) {
      acc[review.facilityId] = {
        facilityName: review.facilityName,
        reviews: []
      }
    }
    acc[review.facilityId].reviews.push(review)
    return acc
  }, {} as Record<string, { facilityName: string; reviews: MyReview[] }>)

  // 테스트용 로그인 처리
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
    router.refresh()
  }

  // 로그인이 필요한 경우
  if (!isLoggedIn) {
    return (
      <div className="container py-8">
        <Card className="styled-card mb-8">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-16 w-16 text-indigo-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">내 리뷰를 보려면 로그인이 필요합니다.</p>
            
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

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <Link href="/profile" className="text-indigo-600 hover:text-indigo-800 font-medium">
            프로필로 돌아가기
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 flex justify-center items-center">
            <p className="text-gray-500">내 리뷰를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <Link href="/profile" className="text-indigo-600 hover:text-indigo-800 font-medium">
          프로필로 돌아가기
        </Link>
      </div>

      {/* 페이지 제목 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">내가 작성한 리뷰</h1>
        <p className="text-gray-600 mt-2">총 {reviews.length}개의 리뷰를 작성했습니다.</p>
      </div>

      {/* 리뷰 목록 */}
      {Object.keys(groupedReviews).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedReviews).map(([facilityId, group]) => (
            <div key={facilityId}>
              {/* 시설명 헤더 */}
              <div className="flex items-center mb-4">
                <Building className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold">{group.facilityName}</h2>
                <Badge variant="outline" className="ml-2">
                  {group.reviews.length}개 리뷰
                </Badge>
              </div>

              {/* 해당 시설의 리뷰들 */}
              <div className="space-y-4">
                {group.reviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      {/* 리뷰 헤더 */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-medium mr-2">{review.rating}점</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{review.createdAt}</span>
                            {review.updatedAt && review.updatedAt !== review.createdAt && (
                              <span className="ml-2">(수정됨: {review.updatedAt})</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditReview(review.id, review.facilityId)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            수정
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                <Trash2 className="h-4 w-4 mr-1" />
                                삭제
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>리뷰를 삭제하시겠습니까?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  이 작업은 되돌릴 수 없습니다. 리뷰가 영구적으로 삭제됩니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* 리뷰 제목 */}
                      <h3 className="font-semibold text-lg mb-2">{review.title}</h3>

                      {/* 리뷰 내용 */}
                      <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

                      {/* 리뷰 이미지 */}
                      {review.images.length > 0 && (
                        <div className="mt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {review.images.map((image, index) => (
                              <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                                <Image
                                  src={image}
                                  alt={`리뷰 이미지 ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 시설 바로가기 */}
                      <div className="mt-4 pt-4 border-t">
                        <Link href={`/facilities/${review.facilityId}`}>
                          <Button variant="outline" size="sm">
                            시설 상세 보기
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 리뷰가 없는 경우 */
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">아직 작성한 리뷰가 없습니다</h3>
            <p className="text-gray-500 mb-4">시설을 이용한 후 첫 번째 리뷰를 작성해보세요!</p>
            <Link href="/facilities">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                시설 둘러보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 