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

export interface operatingHours {
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    holiday: boolean;
}