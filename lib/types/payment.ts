import { MatchPaymentSuccess } from "./matchTypes";

export type PaymentResultResponse = MatchPaymentSuccess | CancelResponse | PaymentFail | ReserveResponse;

// 매치 상태
export interface PaymentResponse {
    status: 'success' | 'fail' | 'cancel';
    type: string;
}

interface ReserveResponse extends PaymentResponse{
    type: 'reservePayment';
    facilityCourt: string;
}

// 페이 실패 데이터
interface PaymentFail extends PaymentResponse {
    type: 'failPayment';
    errorCode: string;
    errorMsg: string;
}

// 취소 이유
interface CancelResponse extends PaymentResponse {
    type: 'cancelPayment';
    cancelReason: string;
}