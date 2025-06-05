import { PaymentStatus } from "../enum/paymentEnum";
import { MatchPaymentSuccess } from "./matchTypes";
import { ReserveResponse } from "./reservationType";

// 결제 내역 카운트
export interface PaymentHistCntResponse {
    matchPaymentCnt: number;
    reservationPaymentCnt: number;
}

// 결제 내역
export interface PaymentHistResponse {
    paymentId: number;
    paymentType: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    paidAt: string;
    cancelReason: string;
    refundAmount: number;
    cancelAt: string;
    facilityName: string;
    courtName: string;
    useDate: string;
    startTime: string;
    endTime: string;
    refId: number;
    refName: string;
}

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

// 결제내역 조회용 인터페이스
export interface PaymentHistory {
    id: number;
    orderId: string;
    paymentKey: string;
    amount: number;
    status: PaymentStatus;
    paymentMethod: string;
    type: 'MATCH' | 'FACILITY';
    matchName?: string;
    facilityName?: string;
    reservationDate?: string;
    createdAt: string;
    cancelReason?: string;
}

export const displayPaymentStatus = (status: PaymentStatus) => {
    let paymentStatus = "";
    
    switch (status) {
        case PaymentStatus.PAID:
            paymentStatus = "결제 완료";
            break;
        
        case PaymentStatus.CANCELED:
            paymentStatus = "취소";
            break;
        
        case PaymentStatus.PARTIAL_CANCELED:
            paymentStatus = "부분 취소";
            break;
        
        case PaymentStatus.REFUNDED: 
            paymentStatus = "환불"
            break;
        default:
            paymentStatus = "결제 대기"
            break;
    }

    return paymentStatus;
}