import { api } from '../api';
import { Payment, ReservationPayment, Slice } from '../types/commonTypes';
import { PaymentResultResponse, PaymentHistory, PaymentHistResponse, PaymentHistCntResponse } from '../types/payment';

// 환불 신청 인터페이스
export interface RefundRequest {
    paymentId: number;
    reason: string;
    refundAmount?: number;
}

export const paymentService = {

    // 관리자 대시보드 총 매출
    getTotalRevenues: (params: {facilityId: number, year: number, month: number}) => {
        let endPoint = `/admin/payment/getTotalRevenues?facilityId=${params.facilityId}&year=${params.year}&month=${params.month}`;
        return api.get<number>(endPoint);
    },

    // 결제 내역 카운트
    getPaymentHistCnt: () => {
        let endPoint = `/payment/getPaymentHistCnt`;
        return api.get<PaymentHistCntResponse>(endPoint);
    },

    // 결제 내역
    getPaymentHist: (params: {type: string, pageNum: number}) => {
        let endPoint = `/payment/paymentHist?type=${params.type}&pageNum=${params.pageNum}`;
        return api.get<Slice<PaymentHistResponse>>(endPoint);
    },

    // 예약 결제 승인
    reservationPayment: (params: ReservationPayment) => {
        let endPoint = '/payment/reservationApprove';
        return api.post<PaymentResultResponse>(endPoint, params);
    },

    // 결제 최종 승인
    paymentApprove: (params: Payment) => {
        let endPoint = '/payment/approve';
        return api.post<PaymentResultResponse>(endPoint, params);
    },

    cancelReservationChk: (param: string) => {
        return api.get<PaymentResultResponse>(`/payment/reservationCancelChk?reservationNumber=${param}`);
    },

    // 결제 취소 상태 확인
    checkCancelStatus: (refundId: string) => {
        return api.get<PaymentResultResponse>(`/payment/cancelStatus?orderId=${refundId}`);
    },

    // 결제내역 조회
    getPaymentHistory: (page: number = 0, size: number = 10) => {
        return api.get<Slice<PaymentHistory>>(`/payment/history?page=${page}&size=${size}`);
    },

    // 환불 신청
    requestRefund: (params: RefundRequest) => {
        return api.post<PaymentResultResponse>('/payment/refund', params);
    },

    // 결제 상세 조회
    getPaymentDetail: (paymentId: number) => {
        return api.get<PaymentHistory>(`/payment/${paymentId}`);
    }
}