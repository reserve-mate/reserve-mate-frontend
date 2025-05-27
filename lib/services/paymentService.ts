import { api } from '../api';
import { Payment, ReservationPayment } from '../types/commonTypes';
import { PaymentResultResponse } from '../types/payment';

export const paymentService = {
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
    }
}