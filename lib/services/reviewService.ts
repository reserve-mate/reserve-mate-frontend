import { api } from "../api";
import { Slice } from "../types/commonTypes";
import { ReviewCountResponse, ReviewDetail, ReviewListResponse, ReviewModifyRequest, ReviewRequestDto, ReviewType } from "../types/reviewTypes";

// 리뷰 서비스
export const reviewService = {

    // 리뷰 수정
    modifyReview: (params: ReviewModifyRequest) => {
        let endPoint = `/review/modify/${params.reviewId}`;

        const formData = new FormData();

        const request = {
            rating: params.rating,
            title: params.title,
            content: params.content,
            delOrderIds: params.delOrderIds
        }

        formData.append(
            'modifyRequest', new Blob([JSON.stringify(request)], {type: 'application/json'})
        );

        if(params.files && params.files.length > 0) {
            params.files.forEach((file) => {
                formData.append('files', file)
            });
        }

        return api.put(endPoint, formData);
    },

    // 리뷰 상세
    getReviewDetail: (params: {reviewId: number, reviewType: ReviewType}) => {
        let endPoint = `/review/${params.reviewId}?reviewType=${params.reviewType}`;
        return api.get<ReviewDetail>(endPoint);
    },

    // 리뷰 삭제
    deleteReview: (param: number) => {
        let endPoint = `/review/delete/${param}`;
        return api.delete(endPoint);
    },

    // 리뷰 작성
    registReview: (params: ReviewRequestDto) => {
        let endPoint = `/review/registReview`;

        const formData = new FormData();

        const reviewData = {
            courtId: params.courtId,
            rating: params.rating,
            title: params.title,
            content: params.content,
            reservationId: params.reservationId,
            reviewType: params.reviewType
        }

        formData.append(
            'reviewRequest', new Blob([JSON.stringify(reviewData)], {type: 'application/json'})
        );

        if(params.files && params.files.length > 0) {
            params.files.forEach(image => {
                formData.append('files', image);
            })
        }

        return api.post(endPoint, formData);

    },

    // 시설 리뷰 정보
    getReviewInfo: (param: number) => {
        let endPoint = `/review/${param}/reviewInfo`;
        return api.get<ReviewCountResponse>(endPoint);
    },

    // 리뷰 목록 조회
    getFacilityReviews: (params: {facilityId: number, pageNum: number}) => {
        let endPoint = `/review/${params.facilityId}/reviews?pageNum=${params.pageNum}`;
        return api.get<Slice<ReviewListResponse>>(endPoint);
    }

}