import { api } from "../api";
import { Slice } from "../types/commonTypes";
import { ReservationDetail, Reservations } from "../types/reservationType";

export const reservationService = {
    // 예약 결제 전 검증
    verifyReservation: (param: number) => {
        let endPoint = `/reserve/verifyReservation?reservationId=${param}`;
        return api.get<boolean>(endPoint);
    },

    // 예약 목록 조회
    getReservations: (params: {type: string, pageNum: number}) => {
        let endPoint = `/reserve/reservations?type=${params.type}&pageNum=${params.pageNum}`;
        return api.get<Slice<Reservations>>(endPoint);
    },

    // 예약 상세
    getReservationDetail: (params: number) => {
        let endPoint = `/reserve/${params}`;
        return api.get<ReservationDetail>(endPoint);
    }
}