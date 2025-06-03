import { api } from "../api";
import { ReservationStatus } from "../enum/reservationEnum";
import { Slice } from "../types/commonTypes";
import { AdminReservationDetail, AdminReservationResponse, DashboardReservation, ReservationDetail, Reservations } from "../types/reservationType";

export const reservationService = {

    // 관리자 대시보드 총 에약 수
    getAdminTotalReservation: () => {
        let endPoint = `/admin/reservation/getAdminTotalReservation`;
        return api.get<number>(endPoint);
    },

    // 관리자 예약 상태 변경
    chgReservationStatus: (params: {id: number, status: string}) => {
        let endPoint = `/admin/reservation/status/${params.id}?status=${params.status}`;
        return api.put(endPoint);
    },

    // 관리자 예약 상세
    getAdminReservaionDetail: (param: number) => {
        let endPoint = `/admin/reservation/${param}`;
        return api.get<AdminReservationDetail>(endPoint);
    },

    // 관리자 예약현황
    getAdminReservations: (params: {searchTerm: string, reserveStatus: string, facility: number, searchDate: string, pageNum: number}) => {
        let endPoint = `/admin/reservation/reservations?searchTerm=${params.searchTerm}&reserveStatus=${params.reserveStatus}&facility=${params.facility}&searchDate=${params.searchDate}&pageNum=${params.pageNum}`;
        return api.get<Slice<AdminReservationResponse>>(endPoint);
    },

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