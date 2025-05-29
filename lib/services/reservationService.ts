import { api } from "../api";
import { Slice } from "../types/commonTypes";
import { DashboardReservation, ReservationDetail, Reservations } from "../types/reservationType";

export const reservationService = {

    // 관리자 대시보드 최근예약
    getDashboardReservations: () => {
        return api.get<DashboardReservation[]>(`/admin/reservation/dashboardReservations`);
    },

    // 예약 취소
    cancelReservation: (params: {id: number, cancelReason: string}) => {
        let endPoint = `/reserve/cancel/${params.id}?cancelReason=${params.cancelReason}`;
        return api.put<string>(endPoint);
    },

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