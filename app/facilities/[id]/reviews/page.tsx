"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ReviewCountResponse, ReviewListResponse } from "@/lib/types/reviewTypes"
import { reviewService } from "@/lib/services/reviewService"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, MessageSquarePlus, Star, Trash, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sportmate.site/';

export default function ReviewsPage({params} : {params: {id: string}}) {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  // 시설 리뷰 조회 데이터
  const [facilityReview, setFacilityReview] = useState<ReviewCountResponse | null>(null);

  // 리뷰 목록 데이터
  const [reviewDatas, setReviewDatas] = useState<ReviewListResponse[]>([]);

  // 무한 스크롤 데이터
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);

  // 무한 스크롤 트리거
  const observeRef = useRef<HTMLDivElement>(null);

  // 리뷰 목록 조회
  const getFacilityReviews = async (pageNum: number) => {
    if(isLoading) return;
    setIsLoading(true);

    try {
      const response = await reviewService.getFacilityReviews({
        facilityId: parseInt(params.id),
        pageNum: pageNum
      });
      
      setReviewDatas((prev) => {
        const merged = [...prev, ...response.content];
        const unique = [... new Map(merged.map(r => [r.reviewId, r])).values()];
        return unique;
      } );
      setPage(pageNum);
      setHasMore(!response.last);
      setIsError(false);
    } catch (error) {
      toast({
        title: "리뷰 조회 실패",
        description: (error instanceof Error) ? (error.message) : "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // 시설 리뷰 정보 조회
  const getReviewInfo = async () => {
    try{
      const response = await reviewService.getReviewInfo(parseInt(params.id));
      setFacilityReview(response);
    }catch(error) {
      toast({
        title: "리뷰 조회 실패",
        description: "리뷰 조회 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsError(true);
    }
  }

  // 리뷰 초기화
  useEffect(() => {
    getReviewInfo()
    getFacilityReviews(0);
  }, []);

  // 무한 스크롤
  useEffect(() => {
    if(!hasMore || isLoading || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          getFacilityReviews(page + 1);
        }
      }, {threshold: 1}
    );

    if(observeRef.current) {
      observer.observe(observeRef.current);
    }

    return () => {
      if(observeRef.current) {
        observer.unobserve(observeRef.current);
      }
    }

  }, [page, hasMore, isLoading]);

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

  // 리뷰 삭제 버튼
  const onDelete = async (reviewId: number) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviewDatas((prev) => prev.filter(review => review.reviewId != reviewId));

      toast({
        title: "리뷰 삭제 성공",
        description: "리뷰가 성공적으로 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "리뷰 삭제 실패",
        description: "리뷰 삭제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // if (isLoading) {
  //   return (
  //     <div className="container py-8">
  //       <div className="flex items-center space-x-2 mb-6">
  //         <ArrowLeft className="h-5 w-5" />
  //         <Link href={`/facilities/${params.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
  //           시설 상세로 돌아가기
  //         </Link>
  //       </div>
  //       <Card className="mb-6">
  //         <CardContent className="p-8 flex justify-center items-center">
  //           <p className="text-gray-500">리뷰를 불러오는 중...</p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  if (!facilityReview) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <Link href={`/facilities/${params.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
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
        <Link href={`/facilities/${params.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
          시설 상세로 돌아가기
        </Link>
      </div>

      {/* 시설 정보 및 리뷰 통계 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{facilityReview.facilityName} 리뷰</CardTitle>
              <div className="flex items-center mt-2">
                <div className="flex mr-2">
                  {renderStars(Math.floor(facilityReview.rating))}
                </div>
                <span className="font-medium mr-2">{parseFloat(facilityReview.rating.toFixed(1))}</span>
                <span className="text-gray-500">({facilityReview.reviewCnt}개 리뷰)</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 리뷰 목록 */}
      <div className="space-y-6">
        {reviewDatas.length > 0 && reviewDatas.map((review) => (
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
                    <div className="flex mr-2">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">{formatDate(review.reviewDate)}</span>
                    </div>
                </div>
            </div>

            {/* 수정/삭제 버튼 */}
            {review.write && (
              <div className="flex gap-2">
                <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              router.push(`/facilities/${params.id}/review/edit?reviewId=${review.reviewId}&reviewType=${review.reviewType}`);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onDelete(review.reviewId)
                            }}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
              </div>
            )}
          </div>

          {/* 리뷰 제목 */}
          <h5 className="font-semibold text-lg mb-2">{review.reviewTitle}</h5>

          {/* 리뷰 내용 */}
          <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewContent}</p>

          {/* 리뷰 이미지 */}
          {review.reviewImages.length > 0 && (
          <div className="mt-4 min-h-[200px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {review.reviewImages.map((image) => (
                  <div
                      key={`${review.reviewId}-${image.imageOrder}`}
                      className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                          src={API_BASE_URL.slice(0, -1) + image.imageUrl}
                          alt={`리뷰 이미지 ${image.imageOrder}`}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          placeholder="blur"
                          blurDataURL="/placeholder.jpg"
                          className="object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"/>
                  </div>
              ))}
              </div>
          </div>
          )}
      </CardContent>
      </Card>
    ))}

        {/* 무한 스크롤 트리거 지점 */}
        <div ref={observeRef} className="text-center min-h-[1]">
          {isLoading && <p className="text-muted-foreground">불러오는 중...</p>}
        </div>
      </div>

      {/* 리뷰가 없는 경우 */}
      {reviewDatas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquarePlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">아직 리뷰가 없습니다</h3>
            <p className="text-gray-500 mb-4">첫 번째 리뷰를 작성해보세요!</p>
            <Link href={`/facilities/${params.id}/review`}>
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