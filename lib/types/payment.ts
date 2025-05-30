import { PaymentStatus } from "../enum/paymentEnum";
import { MatchPaymentSuccess } from "./matchTypes";
import { ReserveResponse } from "./reservationType";

export type PaymentResultResponse = MatchPaymentSuccess | CancelResponse | PaymentFail | ReserveResponse;

// 매치 상태
export interface PaymentResponse {
    status: 'success' | 'fail' | 'cancel';
    type: string;
}

// 페이 실패 데이터
interface PaymentFail extends PaymentResponse {
    status: 'fail';
    type: 'failPayment';
    errorCode: string;
    errorMsg: string;
}

// 취소 이유
interface CancelResponse extends PaymentResponse {
    status: 'cancel'
    type: 'cancelPayment';
    orderId: string;
    cancelReason: string;
}

export const displayPaymentStatus = (status: PaymentStatus) => {
    let paymentStatus = "";
    
    switch (status) {
        case PaymentStatus.PAID:
            paymentStatus = "결제 완료";
            break;
        
        case PaymentStatus.CANCELED:
            paymentStatus = "환불";
            break;
        
        case PaymentStatus.PARTIAL_CANCELED:
            paymentStatus = "부분 환불";
            break;
        default:
            paymentStatus = "결제 대기"
            break;
    }

    return paymentStatus;
}