import { api } from '../api';
import { Payment } from '../types/commonTypes';

export const paymentService = {
    paymentApprove: (params: Payment) => {
        let endPoint = '/payment/approve';
        return api.post(endPoint, params);
    }
}