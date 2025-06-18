
// 리뷰 목록 데이터
export interface ReviewListResponse {
    reviewId: number;
    userId: number;
    userName: number;
    rating: number;
    reviewDate: string;
    reviewTitle: string;
    reviewContent: string;
    reviewImages: ReviewImageResponse[];
}

// 리뷰 이미지 데이터
interface ReviewImageResponse {
    imageUrl: string;
    imageOrder: number;
}