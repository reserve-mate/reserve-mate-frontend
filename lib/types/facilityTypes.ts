import { CourtType } from "../enum/courtEnum";
import { SportType } from "../enum/matchEnum";

export interface ReviewFacility {
    facilityName: string;
    sportType: SportType;
}

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

export interface FacilityManagerListResponse {
    id: number;
    assignedAt: string;
    facilityId: number;
    userId: number;
    managerRole: string;
    userName: string;
    email: string;
    phone: string;
}

export interface FacilityListRequest {
    sportType : string;
    minPrice : number;
    maxPrice : number;
    lastId : string | null;
    size : number;
}

export interface FacilitiesResponse {
    content: Facilities[];
    last : boolean;
}

export interface Facilities {
    facilityId : number;
    facilityName : string;
    sportType : string;
    address : string;
    courtId : number;
    courtName : string;
    fee : number;
    imageUrl : string;
}