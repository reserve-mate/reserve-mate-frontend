import { MatchStatus, SportType } from "../enum/matchEnum";
import { PaymentResponse } from "./payment";

// 관리자 매치 목록 검색
interface AdminMatchSearchRequest {
    searchValue: string;
    sportType: SportType;
    startDate: string;
    endDate: string;
    pageNumber: number;
}

export type AdminMatchSearch = {
    [key in keyof AdminMatchSearchRequest]? : AdminMatchSearchRequest[key];
}

// 관리자 매치 목록 조회
export interface AdminMatches {
    matchId: number;
    matchName: string;
    sportType: SportType;
    facilityName: string;
    matchDate: string;
    teamCapacity: number;
    playerCnt: number;
    matchTime: number;
    endTime: number;
    matchStatus: MatchStatus
}

// 매치 등록 데이터
export interface MatchRegist {
    matchName: string;
    courtId: number;
    managerId: number;
    matchDate: string;
    matchTime: number;
    matchEndTime: number;
    teamCapacity: number;
    description: string | null;
    matchPrice: number;
}

// 페이 실패 데이터
export interface MatchPaymentSuccess extends PaymentResponse {
    type: 'matchPaymentSuccess';
    matchName: string;
    matchDate: string;
    matchTime: number;
    matchEndTime: number;
    facilityCourt: string;
}

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

export interface MatchPayment {
    orderName: string;
    customerEmail: string;
    customerName: string;
    customerMobilePhone: string;
    amount: number;
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
    matchName: string;
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

interface PlayerDto {
    // 실제 응답 구조에 맞게 채워주세요
    playerId: number;
    userName: string;
    profileImage?: string;
}

interface UserDataDto {
    userName: string;
    phone: string;
    userEmail: string;
    orderId: string;
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

// 매치 취소 사유
export type MatchCancellationReason = {
    id: string;
    reason: string;
}

// 매치 취소 요청
export type MatchCancellationRequest = {
    matchId: number;
    reason: string;
}