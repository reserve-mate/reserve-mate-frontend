"use client"

import { useState, useEffect, useRef, useLayoutEffect} from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Star, Edit, Trash2, Building, Calendar, MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { MyReviewCntResponse, MyReviewListResponse, ReviewType } from "@/lib/types/reviewTypes"
import { reviewService } from "@/lib/services/reviewService"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sportmate.site/';

export default function MyReviewsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 리뷰 카운트
  const [reviewCnt, setReviewCnt] = useState<MyReviewCntResponse[]>([]);

  // 리뷰 목록
  const [reviewDatas, setReviewDatas] = useState<MyReviewListResponse[]>([]);

  // 무한 스크롤
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isError, setIsError] = useState(false);

  const observerRef = useRef(null);

  // 스크롤 초기화
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 로그인 상태 확인
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  // 내가 작성한 리뷰 카운트
  useEffect(() => {
    
    // api 호출
    const getMyReviewCnt = async () => {

      try {
        const response = await reviewService.getMyReviewCnt();
        setReviewCnt(response);
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "리뷰를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    }

    getMyReviewCnt();

  }, []);

  // 리뷰 목록 api
  const getMyReviews = async (pageNum: number) => {
    if(isLoading) return;
    setIsLoading(true);

    try {
      const response = await reviewService.getMyReviews(pageNum);
      setReviewDatas((prev) => {
        const merged = [...(prev || []), ...response.content];
        const unique = [...new Map(merged.map(r => [r.reviewId, r])).values()]
        return unique;
      })
      setPage(pageNum);
      setHasMore(!response.last)
      setIsError(false)
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "리뷰를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // 리뷰 목록
  useEffect(() => {
    getMyReviews(0);
  }, [])

  // 무한 스크롤
  useEffect(() => {
    if(isLoading || !hasMore || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          getMyReviews(page + 1)
        }
      }, {threshold: 1}
    );

    if(observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if(observerRef.current) {
        observer.unobserve(observerRef.current)
      }
      observer.disconnect();
    }

  }, [page, hasMore, isError])

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

  const handleEditReview = (reviewId: string, facilityId: string, reviewType: ReviewType) => {
    // 리뷰 수정 페이지로 이동
    router.push(`/facilities/${facilityId}/review/edit?reviewId=${reviewId}&reviewType=${reviewType}`)
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      // 실제 구현에서는 API 호출
      await reviewService.deleteReview(parseInt(reviewId));

      // 삭제 대상 리뷰 찾기
      const deleteReview = reviewDatas.find(r => r.reviewId === parseInt(reviewId));
      if(!deleteReview) return;

      const facilityId = deleteReview.facilityId;

      // 리뷰 목록에서 제거
      setReviewDatas((prev) => prev.filter(review => review.reviewId !== parseInt(reviewId)));

      // 리뷰 카운트 감소
      setReviewCnt((prev) => prev.map((cnt) => cnt.facilityId === facilityId ? 
          {...cnt, facilityCnt: cnt.facilityCnt - 1}
        : cnt).filter((cnt) => cnt.facilityCnt > 0)); // filter는 0개인 시설 제거
      
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
  const groupedReviews = reviewDatas.reduce((acc, review) => {
    const facilityId = review.facilityId;
    if (!acc[review.facilityId]) {
      const facilutyCnt = reviewCnt.find(cnt => cnt.facilityId === facilityId)?.facilityCnt || 0;
      acc[review.facilityId] = {
        facilityName: review.facilityName,
        facilityCnt: facilutyCnt,
        reviews: []
      }
    }
    acc[review.facilityId].reviews.push(review)
    return acc
  }, {} as Record<string, { facilityName: string; facilityCnt: number; reviews: MyReviewListResponse[]; }>)

  // 테스트용 로그인 처리
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
    router.refresh()
  }

  // 리뷰 총 개수
  const totalReviewCnt = () => {
    let totalCnt = reviewCnt.reduce((sum, cnt) => sum + cnt.facilityCnt, 0);
    return totalCnt;
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
        <p className="text-gray-600 mt-2">총 {totalReviewCnt()}개의 리뷰를 작성했습니다.</p>
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
                  {group.facilityCnt}개 리뷰
                </Badge>
              </div>

              {/* 해당 시설의 리뷰들 */}
              <div className="space-y-4">
                {group.reviews.map((review) => (
                  <Card key={review.reviewId} className="overflow-hidden">
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
                            <span>{formatDate(review.createdAt)}</span>
                            {review.updatedAt && review.updatedAt !== review.createdAt && (
                              <span className="ml-2">(수정됨: {formatDate(review.updatedAt)})</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditReview(review.reviewId.toString(), review.facilityId.toString(), review.reviewType)}
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
                                  onClick={() => handleDeleteReview(review.reviewId.toString())}
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
                      <h3 className="font-semibold text-lg mb-2">{review.reviewTitle}</h3>

                      {/* 리뷰 내용 */}
                      <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">{review.reviewContent}</p>

                      {/* 리뷰 이미지 */}
                      {review.images.length > 0 && (
                        <div className="mt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {review.images.map((image) => (
                              <div key={image.imageOrder} className="relative aspect-square overflow-hidden rounded-lg">
                                <Image
                                  src={API_BASE_URL.slice(0, -1) + image.imageUrl}
                                  alt={`리뷰 이미지 ${image.imageOrder}`}
                                  fill
                                  loading="lazy"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  placeholder="blur"
                                  blurDataURL="/placeholder.jpg"
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

      {/* 무한 스크롤 트리거 지점 */}
      <div ref={observerRef} className="text-center min-h-[1]">
        {isLoading && <p className="text-muted-foreground">불러오는 중...</p>}
      </div>
      
    </div>
  )
} 