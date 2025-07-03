"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft, Building, LogIn } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { displaySportName } from "@/lib/types/matchTypes"
import Image from "next/image"
import { ReviewDetail, ReviewImageResponse, ReviewModifyRequest, ReviewType } from "@/lib/types/reviewTypes"
import { reviewService } from "@/lib/services/reviewService"
import { SportType } from "@/lib/enum/matchEnum"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sportmate.site/';

type ReviewInfo = {
  facilityname: string,
  sportType: SportType,
  courtName: string,
  useDate: string
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();

  const query = useSearchParams();

  const reviewId = query.get("reviewId");
  const reviewType = query.get("reviewType");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 리뷰 예약 정보
  const [reviewInfo, setReviewInfo] = useState<ReviewInfo>({
    facilityname: "",
    sportType: SportType.BADMINTON,
    courtName: "",
    useDate: ""
  });

  // 리뷰 데이터
  const [review, setReview] = useState<ReviewDetail>({
    reviewId: 0,
    facilityName: "",
    rating: 0,
    reviewTitle: '',
    reviewContent: '',
    sportType: SportType.BADMINTON,
    courtName: "",
    useDate: "",
    images: []
  });

  // 교체할 이미지 목록
  const [delOrderIds, setDelOrderIds] = useState<number[]>([]);

  // 이미 존재하는 이미지
  const [existImg, setExistImg] = useState<ReviewImageResponse[]>([]);

  // 이미지 업로드 상태
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  if(!reviewId || !reviewType) {
    router.back();
    return;
  }

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

  // 리뷰 데이터 가져오기
  useEffect(() => {

    const reviewResponse = async () => {
      setIsLoading(true);
      try {
        const response = await reviewService.getReviewDetail({
          reviewId: parseInt(reviewId)
          , reviewType: reviewType as ReviewType
        });
        setReview(response);
      } catch (error) {
        toast({
          title: "리뷰 정보 조회 실패",
          description: error instanceof Error ? error.message : "리뷰 정보를 찾지 못하였습니다.",
          variant: "destructive",
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    }

    reviewResponse();

  }, []);

  // 리뷰 정보 가져오기
  useEffect(() => {
    if(review) {
      setReviewInfo({
        facilityname: review.facilityName,
        sportType: review.sportType,
        courtName: review.courtName,
        useDate: review.useDate
      });
    }
  }, [review])

  // 리뷰 이미지 상태 초기화
  useEffect(() => {
    if(review?.images) {
      const sortedImages = review.images
      .sort((a, b) => a.imageOrder - b.imageOrder);
      setExistImg(sortedImages);

      const initialPreviews = sortedImages.map(
        (image) => API_BASE_URL.slice(0, -1) + image.imageUrl
      );
    
      setImagePreviews(initialPreviews);
    }
  }, [review])

  // 리뷰 입력 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setReview((prev) => ({ ...prev, [name]: value }))
  }

  // 별점 변경 처리
  const handleRatingChange = (rating: number) => {
    setReview((prev) => ({...prev, rating }));
  }

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let selectedFiles = Array.from(files);

    const totalCnt = existImg.length + images.length;

    // 최대 3개로 제한
    if (selectedFiles.length + totalCnt > 3) {
      toast({
        title: "이미지는 최대 3개까지 업로드할 수 있습니다.",
        variant: "destructive",
      });
      selectedFiles = selectedFiles.slice(0, 3 - totalCnt);
    }
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);
    
    // 미리보기 URL 생성
    const newPreviews = [ 
      ...existImg.map((file) => API_BASE_URL.slice(0, -1) + file.imageUrl)
      , ...newImages.map((file) => URL.createObjectURL(file))
    ];
    setImagePreviews(newPreviews);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (idx: number) => {
    const totalExisting = existImg.length;

    if(idx < totalExisting) { // 기존 이미지 지우기
      const removed = existImg[idx];
      setDelOrderIds((prev) => [...prev, removed.imageOrder]);

      const newExisting = existImg.filter((_, i) => i !== idx);
      setExistImg(newExisting);

      const previews = [ 
        ...newExisting.map((file) => API_BASE_URL.slice(0, -1) + file.imageUrl)
        , ...images.map((file) => URL.createObjectURL(file))
      ];
      setImagePreviews(previews);
    }else { // 새 업로드 이미지 삭제
      const fileIdx = idx - totalExisting;
      const newImages = images.filter((_, i) => i !== fileIdx);
      setImages(newImages);

      const previews = [
        ...existImg.map((file) => API_BASE_URL.slice(0, -1) + file.imageUrl)
        , ...newImages.map((file) => URL.createObjectURL(file))
      ]
      setImagePreviews(previews);
    }

  };

  // 리뷰 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (review.rating === 0) {
      toast({
        title: "별점을 선택해주세요",
        description: "리뷰를 작성하기 위해서는 별점이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    if (!review.reviewTitle.trim()) {
      toast({
        title: "제목을 입력해주세요",
        description: "리뷰 제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!review.reviewContent.trim()) {
      toast({
        title: "내용을 입력해주세요",
        description: "리뷰 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {

      const request: ReviewModifyRequest = {
        reviewId: review.reviewId,
        rating: review.rating,
        title: review.reviewTitle,
        content: review.reviewContent,
        delOrderIds: delOrderIds,
        files: images
      }

      // 실제 구현에서는 API 호출을 통해 리뷰를 저장
      await reviewService.modifyReview(request);
      
      setTimeout(() => {
        toast({
          title: "리뷰가 등록되었습니다",
          description: "소중한 의견을 공유해주셔서 감사합니다.",
        })
        location.reload();
      }, 1000)
    } catch (error) {
      toast({
        title: "리뷰 등록 실패",
        description: (error instanceof Error) ? (error.message) : "리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-based
  const day = date.getDate();
  const weekday = date.toLocaleDateString("ko-KR", { weekday: "long" });

  return `${year}년 ${month}월 ${day}일 ${weekday}`;
};

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
          <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-800 font-medium">
            예약 목록으로 돌아가기
          </button>
        </div>
        <Card>
          <CardContent className="p-8 flex justify-center items-center">
            <p className="text-gray-500">시설 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reviewInfo) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-800 font-medium">
            예약 목록으로 돌아가기
          </button>
        </div>
        <Card>
          <CardContent className="p-8 flex justify-center items-center">
            <p className="text-gray-500">시설 정보를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if(review) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-800 font-medium">
            예약 목록으로 돌아가기
          </button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">리뷰 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Building className="h-5 w-5 text-indigo-500 mr-2" />
                <h3 className="text-lg font-semibold">{reviewInfo.facilityname}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {displaySportName(reviewInfo.sportType)} / {reviewInfo.courtName} / {formatDate(reviewInfo.useDate)}
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
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {review.rating > 0
                      ? `${review.rating}점을 선택하셨습니다`
                      : "별점을 선택해주세요"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    제목
                  </Label>
                  <Input
                    id="title"
                    name="reviewTitle"
                    placeholder="리뷰 제목을 입력해주세요"
                    value={review.reviewTitle}
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
                    name="reviewContent"
                    placeholder="시설 이용 경험을 자세히 공유해주세요"
                    rows={6}
                    value={review.reviewContent}
                    onChange={handleInputChange}
                    className="resize-none border-indigo-200 focus:border-indigo-300 focus:ring-indigo-300"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="images">이미지 업로드 (최대 3장)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={(existImg.length + images.length) >= 3}
                  />
                  <div className="flex gap-2 mt-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative w-24 h-24">
                        <Image src={src} alt={`preview-${idx}`} fill className="object-cover rounded" />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                  onClick={() => router.back()}
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
} 