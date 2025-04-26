import { MatchStatus, SportType } from "../enum/matchEnum";

// 매치 검색
export interface MatchSearchRequest {
    searchValue: string;
    sportType: SportType;
    matchDate: string;
    pageNumber: number;  // 선택적 프로퍼티
}

// MatchSearchRequest 모든 프로퍼티를 선택적 프로퍼티로 설정
export type MatchSearch = {
    [key in keyof MatchSearchRequest]?: MatchSearchRequest[key];
}

export interface MathDateCount {
    matchDate: string;
    matchCnt: number;
}

// 매치 생성 요청 타입
export interface CreateMatchRequest {
    title: string;
    sportType: string;
    facilityId: number;
    matchDate: string;
    startTime: string;
    endTime: string;
    maxParticipants: number;
    fee: number;
    description?: string;
    equipmentProvided: boolean;
    courtId: number;
    managerId?: number;
    images?: File[];
}

// 매치 리스트
export type MatchList = {
    matchId: number;
    matchName: string;
    matchStatus: string;
    facilityName: string;
    fullAddress: string;
    matchDate: string;
    matchTime: number;
    matchEndTime: number;
    sportType: SportType;
    matchPrice: number;
    teamCapacity: number;
    playerCnt: number;
}

export interface MatchDetailRespone {
    matchDataDto: MatchDataDto;
    facilityDataDto: FacilityDataDto;
    playerCnt: number;
    playerDtos: PlayerDto[];        // 현재 비어 있지만 타입 선언은 필요
    userDataDto: UserDataDto | null;
}

interface MatchDataDto {
    matchId: number;
    manager: string;
    mangerImage: string;
    matchStatus: MatchStatus; // enum으로 정의하면 더 좋음
    teamCapacity: number;
    description: string | null;
    matchDate: string; // "2025년 04월 16일 수" 같은 문자열
    matchTime: number;
    matchEndTime: number;
    matchPrice: number;
}

interface FacilityDataDto {
    facilityName: string;
    address: string;
    courtName: string;
    sportType: SportType // 필요 시 enum 처리
    imageDtos: string[];
}

// interface ImageDto {
//     imageUrl?: string; // 빈 배열일 경우도 있으니 optional로 선언
// }

interface PlayerDto {
    // 실제 응답 구조에 맞게 채워주세요
    playerId: number;
    userName: string;
    profileImage?: string;
}

interface UserDataDto {
    userName: string;
    phone: string;
    isMatchApply: boolean;
}

// 매치 타입 정의
export interface Match {
    id: number;
    title: string;
    sportType: string;
    facilityId: number;
    facilityName: string;
    address: string;
    matchDate: string;
    matchTime: string;
    maxParticipants: number;
    currentParticipants: number;
    fee: number;
    description?: string;
    equipmentProvided: boolean;
    courtId: number;
    courtName: string;
    managerId?: number;
    managerName?: string;
    status: MatchStatus;
    createdAt: string;
    images?: string[];
}