import { api } from '../api';
import { Payment } from '../types/commonTypes';
import { PaymentResultResponse } from '../types/payment';

export const paymentService = {
    paymentApprove: (params: Payment) => {
        let endPoint = '/payment/approve';
        return api.post<PaymentResultResponse>(endPoint, params);
    }
}