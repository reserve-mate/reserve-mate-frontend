import { SportType } from "../enum/matchEnum";
import { ReservationStatus } from "../enum/reservationEnum";

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