import { SportType } from "../enum/matchEnum";

export enum ReviewType {
    MATCH = "MATCH",
    RESERVATION = "RESERVATION"
}

// 리뷰 수정
export interface ReviewModifyRequest {
    reviewId: number;
    rating: number;
    title: string;
    content: string;
    delOrderIds: number[];
    files?: File[];
}

// 리뷰 상세
export interface ReviewDetail {
    reviewId: number;
    facilityName: string;
    rating: number;
    reviewTitle: string;
    reviewContent: string;
    sportType: SportType;
    courtName: string;
    useDate: string
    images: ReviewImageResponse[];
}

// 리뷰 작성
export interface ReviewRequestDto {
    courtId: number;
    rating: number;
    title: string;
    content: string;
    reservationId: number;
    reviewType: ReviewType;
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
    reviewType: ReviewType;
    reviewImages: ReviewImageResponse[];
}

// 리뷰 이미지 데이터
export interface ReviewImageResponse {
    imageUrl: string;
    imageOrder: number;
}