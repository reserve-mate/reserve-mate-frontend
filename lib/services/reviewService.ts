import { api } from "../api";
import { Slice } from "../types/commonTypes";
import { ReviewCountResponse, ReviewListResponse } from "../types/reviewTypes";

// 리뷰 서비스
export const reviewService = {

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