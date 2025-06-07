import { MatchStatus } from "../enum/matchEnum";
import { PaymentStatus, ReturnPolicy } from "../enum/paymentEnum";
import { ReservationStatus } from "../enum/reservationEnum";
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
    matchStatus: MatchStatus;
    reservationStatus: ReservationStatus;
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

// 예약 환불 가격 게산 로직
export const reservationRefundAmount = (reservation: {
  reserveDate: string;     // 예: "2025-06-12"
  startTime: string;       // 예: "14:00:00"
}, amount: number): number => {
    const now = new Date();
    const reserveDateTime = new Date(`${reservation.reserveDate}T${reservation.startTime}`);

    const diffMs = reserveDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    let refund = 0;

    if (diffHours >= ReturnPolicy.TWO_DAY_AGO_BY_HOUR) {
        // 48시간 전: 전액 환불
        refund = amount;
    } else if (diffHours >= ReturnPolicy.ONE_DAY_AGO_BY_HOUR) {
        // 24~48시간 전: 50% 환불
        refund = Math.floor(amount * ReturnPolicy.RETURN_50);
    } else if (diffHours > 0) {
        // 당일 취소: 환불 없음
        refund = 0;
    }

    return refund;
}

// 매치 환불 가격 계산 로직
export const refundAmount = (match: {
    matchDate: string; // 'YYYY-MM-DD'
    matchTime: string; // 24시간제 (예: 18 = 오후 6시)
    matchPrice: number;
}): number  => {
    const now = new Date();
    const matchDateTime = new Date(`${match.matchDate}T${match.matchTime}`);

    const diffMs = matchDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffMinutes = diffMs / (1000 * 60);

    let price = match.matchPrice;

    if (diffHours <= ReturnPolicy.TWO_DAY_AGO_BY_HOUR && diffHours >= ReturnPolicy.ONE_DAY_AGO_BY_HOUR) {
    // 매치 시작 24시간 이내 취소 시 80% 환불
    price = Math.floor(price * ReturnPolicy.RETURN_80);
    } else if (diffMinutes < ReturnPolicy.ONE_DAY_AGO_BY_MINUTE && diffMinutes >= ReturnPolicy.ONE_HOUR_HALF_AGO) {
    // 매치 당일 ~ 90분 전까지는 20% 환불
    price = Math.floor(price * ReturnPolicy.RETURN_20);
    } else if (diffMinutes < ReturnPolicy.ONE_HOUR_HALF_AGO) {
    price = 0;
    }

    return price;
}

// 결제 상태 화면 노출
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