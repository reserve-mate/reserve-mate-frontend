import { SportType } from "../enum/matchEnum";
import { PaymentStatus } from "../enum/paymentEnum";
import { ReservationStatus } from "../enum/reservationEnum";

// 리뷰 예약 사전 정보
export interface ReviewReservation {
    courtId: number;
    reservationNumber: string;
    sportType: SportType;
    facilityName: string;
    useDateDate: string;
}

// 관리자 예약 상세
export interface AdminReservationDetail {
    reservationId: number;
    reservationStatus: ReservationStatus;
    reservationNumber: string
    userName: string;
    userEmail: string;
    phone: string;
    facilityName: string;
    courtName: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    createAt: string;
    cancelReason: string;
    cancelAt: string;
    paymentStatus: PaymentStatus;
    refundAmount: number;
}

// 관리자 예약 현황
export interface AdminReservationResponse {
    reservationId: number;
    userName: string;
    facilityName: string;
    courtName: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    reservationStatus: ReservationStatus;
    totalPrice: number;
}

// 대시보드 최근예약 데이터
export interface DashboardReservation {
    reservationId: number;
    userName: string;
    facilityName: string;
    reserveDate: string;
    startTime: string;
    endTime: string;
    reservationStatus: ReservationStatus;
    totalPrice: number;
}

// 예약 결제 성공 데이터
export interface ReserveResponse extends PaymentResponse{
    status: 'success';
    type: 'reservePaymentSuccess';
    reservationId: number;
    reservationNumber: string;
    facilityName: string;
    courtName: string;
    reserveDate: string;
    startTime: string;
    endTime: string;
}

// 예약 상세
export interface ReservationDetail {
    reservationId: number;
    reservationStatus: ReservationStatus;
    reservationDate: string;
    startTime: string;
    endTime: string;
    bookedName: string;
    reservationNumber: string;
    userEmail: string;
    userPhone: string;
    facilityId: number;
    facilityName: string;
    courtName: string;
    sportType: SportType;
    address: string;
    totalPrice: number;
    refundPayment: number;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    cancelReason: string;
    canceledAt: string;
}

// 예약 목록
export interface Reservations {
    reservationId: number;
    reservationStatus: ReservationStatus;
    facilityName: string;
    courtName: string;
    sportType: SportType;
    address: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
}

// 예약상태 한글화
export const displayReservationStatus = (status: ReservationStatus) => {
    let statusStr = "";

    switch (status) {
        case ReservationStatus.PENDING:
            statusStr = "대기중";
            break;
        
        case ReservationStatus.CONFIRMED:
            statusStr = "확정";
            break;
        
        case ReservationStatus.COMPLETED:
            statusStr = "완료";
            break;

        case ReservationStatus.CANCELED:
            statusStr = "취소";
            break;
    }

    return statusStr;
}