export enum PaymentStatus {
    PAID = "PAID",
    CANCELED = "CANCELED",
    PARTIAL_CANCELED = "PARTIAL_CANCELED",
    REFUNDED = "REFUNDED"
}

export const ReturnPolicy = {
    TWO_DAY_AGO_BY_HOUR: 48,
    ONE_DAY_AGO_BY_HOUR: 24,
    ONE_DAY_AGO_BY_MINUTE: 1440,
    ONE_HOUR_HALF_AGO: 90,
    RETURN_80: 0.8,
    RETURN_20: 0.2,
    RETURN_50: 0.5
};