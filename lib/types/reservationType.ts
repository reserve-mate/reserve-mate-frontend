import { SportType } from "../enum/matchEnum";
import { PaymentStatus } from "../enum/paymentEnum";
import { ReservationStatus } from "../enum/reservationEnum";

// 예약 확인
export interface ReservationCheck {
    
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
    facilityId: number;
    facilityName: string;
    courtName: string;
    sportType: SportType;
    address: string;
    totalPrice: number;
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