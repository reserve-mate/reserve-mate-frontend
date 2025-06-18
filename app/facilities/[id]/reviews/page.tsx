"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MessageSquarePlus, User } from "lucide-react"
import { ReviewListResponse } from "@/lib/types/reviewTypes"
import { reviewService } from "@/lib/services/reviewService"
import { toast } from "@/hooks/use-toast"

// 리뷰 데이터 타입
type Review = {
  id: string
  userName: string
  rating: number
  title: string
  content: string
  images: string[]
  createdAt: string
}

// 시설 기본 정보 타입
type FacilityInfo = {
  id: string
  name: string
  rating: number
  totalReviews: number
}

// 더미 데이터
const dummyFacility: FacilityInfo = {
  id: "1",
  name: "서울 테니스 센터",
  rating: 4.5,
  totalReviews: 24
}

const dummyReviews: Review[] = [
  {
    id: "1",
    userName: "김철수",
    rating: 4,
    title: "좋은 시설이에요",
    content: "코트 상태가 좋고 직원분들이 친절해요. 다음에 또 이용할 예정입니다. 시설이 깨끗하고 샤워실도 잘 되어있어서 만족스러웠습니다.",
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    userName: "이영희",
    rating: 5,
    title: "최고의 테니스장!",
    content: "시설이 깨끗하고 위치도 좋아요. 주차 공간도 넉넉해서 편리했습니다. 코트 바닥 상태도 좋고 조명도 밝아서 야간 경기하기에도 좋습니다.",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    userName: "박민수",
    rating: 3,
    title: "평범한 시설",
    content: "가격 대비 괜찮은 편이지만 아쉬운 부분들이 있어요. 전체적으로는 만족스럽습니다.",
    images: [],
    createdAt: "2024-01-05"
  },
  {
    id: "4",
    userName: "정수연",
    rating: 5,
    title: "완벽한 시설과 서비스",
    content: "정말 깨끗하고 좋은 시설입니다. 직원분들도 친절하시고 예약 시스템도 편리해요. 강력 추천합니다!",
    images: ["/placeholder.jpg"],
    createdAt: "2024-01-01"
  }
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sportmate.site/';

export default function ReviewsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [facility, setFacility] = useState<FacilityInfo | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  // 리뷰 목록 데이터
  const [reviewDatas, setReviewDatas] = useState<ReviewListResponse[]>([]);

  // 무한 스크롤 데이터
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API 호출
    const fetchData = async () => {
      //setIsLoading(true)
      try {
        // API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500))
        setFacility(dummyFacility)
        setReviews(dummyReviews)
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  // 리뷰 목록 조회
  const getFacilityReviews = async (pageNum: number) => {
    if(isLoading) return;
    setIsLoading(true);

    try {
      const response = await reviewService.getFacilityReviews({
        facilityId: parseInt(id),
        pageNum: pageNum
      });
      setReviewDatas(response.content);
    } catch (error) {
      toast({
        title: "리뷰 조회 실패",
        description: (error instanceof Error) ? (error.message) : "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  // 리뷰 조회
  useEffect(() => {
    getFacilityReviews(page);
  }, [id])

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

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <Link href={`/facilities/${id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
            시설 상세로 돌아가기
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 flex justify-center items-center">
            <p className="text-gray-500">리뷰를 불러오는 중...</p>
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
          <Link href={`/facilities/${id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
            시설 상세로 돌아가기
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
    <div className="container py-8 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <Link href={`/facilities/${id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
          시설 상세로 돌아가기
        </Link>
      </div>

      {/* 시설 정보 및 리뷰 통계 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{facility.name} 리뷰</CardTitle>
              <div className="flex items-center mt-2">
                <div className="flex mr-2">
                  {renderStars(Math.floor(facility.rating))}
                </div>
                <span className="font-medium mr-2">{facility.rating}</span>
                <span className="text-gray-500">({facility.totalReviews}개 리뷰)</span>
              </div>
            </div>
            <Link href={`/facilities/${id}/review`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                리뷰 작성
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* 리뷰 목록 */}
      <div className="space-y-6">
        {reviewDatas.map((review) => (
          <Card key={review.reviewId} className="overflow-hidden">
            <CardContent className="p-6">
              {/* 리뷰 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{review.userName}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(review.reviewDate)}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                  {review.rating}점
                </Badge>
              </div>

              {/* 리뷰 제목 */}
              <h5 className="font-semibold text-lg mb-2">{review.reviewTitle}</h5>

              {/* 리뷰 내용 */}
              <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewContent}</p>

              {/* 리뷰 이미지 */}
              {review.reviewImages.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {review.reviewImages.map((image, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={API_BASE_URL.substring(0, API_BASE_URL.length - 1) + image.imageUrl}
                          alt={`리뷰 이미지 ${image.imageOrder}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 리뷰가 없는 경우 */}
      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquarePlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">아직 리뷰가 없습니다</h3>
            <p className="text-gray-500 mb-4">첫 번째 리뷰를 작성해보세요!</p>
            <Link href={`/facilities/${id}/review`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                리뷰 작성하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 