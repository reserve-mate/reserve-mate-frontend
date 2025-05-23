import { api } from "../api";
import { Slice } from "../types/commonTypes";
import { Reservations } from "../types/reservationType";

export const reservationService = {
    // 예약 목록 조히
    getReservations: (params: {type: string, pageNum: number}) => {
        let endPoint = `/reserve/reservations?type=${params.type}&pageNum=${params.pageNum}`;
        return api.get<Slice<Reservations>>(endPoint);
    }
}