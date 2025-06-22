import { api } from "../api";
import { Slice } from "../types/commonTypes";
import { ReviewCountResponse, ReviewDetail, ReviewListResponse, ReviewRequestDto } from "../types/reviewTypes";

// 리뷰 서비스
export const reviewService = {

    // 리뷰 상세
    getReviewDetail: (param: number) => {
        let endPoint = `/review/${param}`;
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
            facilityId: params.facilityId,
            rating: params.rating,
            title: params.title,
            content: params.content
        }

        formData.append(
            'reviewRequest', new Blob([JSON.stringify(reviewData)], {type: 'application/json'})
        );

        if(params.files && params.files.length > 0) {
            const fakeFile = new File(["dummy content"], "test-script.exe", { type: "application/x-msdownload" });
            params.files = [fakeFile];
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