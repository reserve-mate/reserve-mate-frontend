import { CourtType } from "../enum/courtEnum";

export interface FacilityNames {
    facilityId: number;
    facilityName: string;
    address: string;
    startTime: string;
    endTime: string;
    holiday: boolean;
}

export interface CourtName {
    courtId: number;
    courtName: string;
    courtType: CourtType;
}

export interface FacilityManagerName {
    managerId: number;
    managerName: string;
    managerEmail: string;
}

export interface OperatingHours {
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    holiday: boolean;
}

export interface Address {
    zipcode: string;
    city: string;
    district: string;
    streetAddress: string;
    detailAddress: string;
}

export interface AssignFacilityManagerRequest {
    userName: string;
    email: string;
    managerRole: string;
}