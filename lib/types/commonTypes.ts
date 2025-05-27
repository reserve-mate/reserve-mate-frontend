export interface Slice<T> {
    content: T[];
    number: number;
    size: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface ApiError {
    errorCode: string;
    message: string;
}

export type ApiResonse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: ApiError;
};

// 페이 요청 성공 후 데이터
export interface Payment {
    orderId: string;
    paymentKey: string;
    amount: number;
    matchId: number;
}

// 예약 결제 요청 후 데이터
export interface ReservationPayment {
    orderId: string;
    paymentKey: string;
    amount: number;
    reservationId: number;
}

// 위도 경도
export interface Location {
    latitude: number;   // 위도 y축
    longitude: number;  // 경도 x축
}