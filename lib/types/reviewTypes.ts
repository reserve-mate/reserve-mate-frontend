
// 리뷰 상세
export interface ReviewDetail {
    reviewId: number;
    rating: number;
    reviewTitle: string;
    reviewContent: string;
    images: ReviewImageResponse[];
}

// 리뷰 작성
export interface ReviewRequestDto {
    facilityId: number;
    rating: number;
    title: string;
    content: string;
    files?: File[];
}

// 시설 리뷰 정보
export interface ReviewCountResponse {
    facilityName: string;
    reviewCnt: number;
    rating: number;
}

// 리뷰 목록 데이터
export interface ReviewListResponse {
    reviewId: number;
    userId: number;
    userName: string;
    rating: number;
    reviewDate: string;
    reviewTitle: string;
    reviewContent: string;
    write: boolean;
    reviewImages: ReviewImageResponse[];
}

// 리뷰 이미지 데이터
interface ReviewImageResponse {
    imageUrl: string;
    imageOrder: number;
}