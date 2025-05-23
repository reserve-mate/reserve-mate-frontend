import { api } from '../api';
import { Payment } from '../types/commonTypes';
import { PaymentResultResponse } from '../types/payment';

export const paymentService = {
    // 결제 최종 승인
    paymentApprove: (params: Payment) => {
        let endPoint = '/payment/approve';
        return api.post<PaymentResultResponse>(endPoint, params);
    },

    // 결제 취소 상태 확인
    checkCancelStatus: (refundId: string) => {
        return api.get<PaymentResultResponse>(`/payment/cancelStatus?orderId=${refundId}`);
    }
}