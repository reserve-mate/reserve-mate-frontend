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