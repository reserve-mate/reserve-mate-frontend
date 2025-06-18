import { api } from "../api";
import { Slice } from "../types/commonTypes";
import { ReviewListResponse } from "../types/reviewTypes";

// 리뷰 서비스
export const reviewService = {

    // 리뷰 목록 조회
    getFacilityReviews: (params: {facilityId: number, pageNum: number}) => {
        let endPoint = `/review/${params.facilityId}/reviews?pageNum=${params.pageNum}`;
        return api.get<Slice<ReviewListResponse>>(endPoint);
    }

}