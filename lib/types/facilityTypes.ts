import { CourtType } from "../enum/courtEnum";
import { SportType } from "../enum/matchEnum";
import { FacilityDetailReview } from "./reviewTypes";

// 시설 상세
export interface FacilityDetail {
    facilityId: number;
    facilityName: string;
    sportType: SportType;
    address: string;
    description: string;
    hours: OperatingHours[];
    courts: Court[];
    reviews: FacilityDetailReview[];
    managerPhoneNumber: string;
    imageUrl: string;
    rating: number;
}

// 시설 상세 코트
interface Court {
    id: number;
    name: string;
    courtType: CourtType;
    width: number;
    height: number;
    indoor: boolean;
    active: boolean;
    fee: number;
}

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

// 요일 한글화
export const displayDayOfWeek = (dayOfWeek: string) => {

    switch (dayOfWeek) {
    case "MONDAY":
        return "월요일";
    case "TUESDAY":
        return "화요일";
    case "WEDNESDAY":
        return "수요일";
    case "THURSDAY":
        return "목요일";
    case "FRIDAY":
        return "금요일";
    case "SATURDAY":
        return "토요일";
    case "SUNDAY":
        return "일요일";
    default:
      return dayOfWeek; // 알 수 없는 값일 경우 원본 반환
}

}