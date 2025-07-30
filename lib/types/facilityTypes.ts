import { CourtType } from "../enum/courtEnum";
import { SportType } from "../enum/matchEnum";
import { FacilityDetailReview } from "./reviewTypes";

// 인기 시설
export interface PoppularFacility {
    facilityId: number;
    name: string;
    description: string;
    imageUrl: string;
    courts: CourtIdName[];
}

// 코트 이름 번호
interface CourtIdName {
    courtId: number;
    name: string;
}

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
export interface Court {
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

// 코트 타입 한글화
export const getCourtTypeLabel = (value: CourtType): string => {
    switch (value) {
    // 테니스
    case CourtType.CLAY_TENNIS:
        return "클레이코트";
    case CourtType.HARD:
        return "하드코트";
    case CourtType.GRASS:
        return "잔디코트";
    case CourtType.SYNTHETIC_TENNIS:
        return "합성소재";

    // 풋살
    case CourtType.RUBBER_FUTSAL:
        return "고무바닥";
    case CourtType.SYNTHETIC_FUTSAL:
        return "합성표면";
    case CourtType.ARTIFICIAL_TURF_FUTSAL:
        return "인조잔디";

    // 농구
    case CourtType.WOODEN_BASKET:
        return "목재바닥";
    case CourtType.SYNTHETIC_BASKET:
        return "합성소재";

    // 배구
    case CourtType.WOODEN_VOLLEY:
        return "목재바닥";
    case CourtType.SYNTHETIC_VOLLEY:
        return "합성소재";

    // 🏸 배드민턴
    case CourtType.WOODEN_BM:
        return "목재바닥";
    case CourtType.SYNTHETIC_BM:
        return "합성소재";
    case CourtType.RUBBER_BM:
        return "고무바닥";

    // 야구
    case CourtType.NATURE_GRASS_BASE:
        return "천연잔디";
    case CourtType.ARTIFICIAL_TURF_BASE:
        return "인조잔디";
    case CourtType.DIRT_BASE:
        return "흙";
    case CourtType.CLAY_BASE:
        return "점토";

    // 축구
    case CourtType.NATURE_GRASS_FB:
        return "천연잔디";
    case CourtType.ARTIFICIAL_TURF_FB:
        return "인조잔디";
    case CourtType.DIRT_FB:
        return "흙";

    default:
        return "알 수 없음";
    }
}