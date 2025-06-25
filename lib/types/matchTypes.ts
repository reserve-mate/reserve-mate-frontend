import { MatchStatus, PlayerStatus, RemovalReason, SportType } from "../enum/matchEnum";
import { PaymentResponse } from "./payment";

// 매치 이용내역
export interface MatchHistoryResponse {
    matchId: number;
    playerId: number;
    matchName: string;
    sportType: SportType;
    playerStatus: PlayerStatus;
    matchStatus: MatchStatus;
    facilityId: number;
    facilityName: string;
    address: string;
    matchDate: string;
    matchTime: number;
    endTime: number;
    matchPrice: number;
    teamCapacity: number;
    playerCnt: number;
    reviewId: number;
    ejectReason: RemovalReason
}

export type PlayerEject = {
    ejectionReason: RemovalReason;
    facilityId: number
}

export interface AdminMatchDetail {
    matchId: number;
    matchTitle: string;
    sportType: SportType;
    matchStatus: MatchStatus;
    facilityId: number;
    facilityName: string;
    facilityCourtId: number;
    facilityCourt: string;
    address: string;
    matchDate: string;
    matchTime: number;
    endTime: number;
    teamCapacity: number;
    matchPrice: number;
    managerId: number;
    managerName: string;
    description: string;
    adminPlayers: AdminPlayer[];
}

export interface AdminPlayer {
    payerId: number;
    userName: string;
    email: string;
    phone: string;
    playerStatus: PlayerStatus;
    ejectReason: RemovalReason;
    joinDate: string;
}

// 관리자 매치 목록 검색
interface AdminMatchSearchRequest {
    searchValue: string;
    sportType: SportType;
    matchStatus: MatchStatus;
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
    status: 'success'
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
    matchStatus: MatchStatus;
    region: string;
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
    matchStatus: MatchStatus;
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

// 종목별 이름 화면 노출
export const displaySportName = (sportType: SportType | null) => {
    let sportName = "";

    switch (sportType) {
        case SportType.BADMINTON:
            sportName = "배드민턴";
            break;

        case SportType.SOCCER:
            sportName = "축구";
            break;

        case SportType.BASKETBALL:
            sportName = "농구";
            break;

        case SportType.TENNIS:
            sportName = "테니스";
            break;

        case SportType.BASEBALL:
            sportName = "야구";
            break;

        case SportType.FUTSAL:
            sportName = "풋살";
            break;

        default:
            sportName = "기타";
            break;
    }

    return sportName;
}

// 매치 상태 한글화
export const displayMatchStatus = (matchStatus: MatchStatus) => {
    let statusName = "";

    switch (matchStatus) {
        case MatchStatus.FINISH:
            statusName = "마감";
            break;

        case MatchStatus.CLOSE_TO_DEADLINE:
            statusName = "마감임박";
            break;

        case MatchStatus.APPLICABLE:
            statusName = "모집중";
            break;

        case MatchStatus.END:
            statusName = "종료";
            break;
        
        case MatchStatus.ONGOING:
            statusName = "진행중";
            break;
        
        case MatchStatus.CANCELLED:
            statusName = "취소";
            break;
    }

    return statusName;
}

// 참가장 상태 한글화
export const displayPlayerStatus = (status: PlayerStatus) => {

    let statusName = "";

    switch (status) {
        case PlayerStatus.CANCEL:
            statusName = "취소";
            break;
        
        case PlayerStatus.COMPLETED:
            statusName = "완료";
            break;
        
        case PlayerStatus.KICKED:
            statusName = "퇴장";
            break;
        
        case PlayerStatus.MATCH_CANCELLED:
            statusName = "매치 취소";
            break;
        
        case PlayerStatus.ONGOING:
            statusName = "진행중";
            break;
        
        case PlayerStatus.READY:
            statusName = "준비";
            break;
    }

    return statusName;
}

// 퇴장 사유 한글화
export const displayEjectReason = (reason: RemovalReason) => {
    let statusName = "";

    switch (reason) {
        case RemovalReason.LATE: 
            statusName = "지각";
            break;
        
        case RemovalReason.ABUSIVE_BEHAVIOR:
            statusName = "폭언/비매너";
            break;
        
        case RemovalReason.SERIOUS_RULE_VIOLATION:
            statusName = "심각한 룰위반";
            break;
    }

    return statusName;
}

// 매치 이용내역 타입 정의
export interface MatchHistory {
    playerId: number;
    matchId: number;
    matchName: string;
    facilityName: string;
    address: string;
    sportType: SportType;
    matchDate: string;
    matchTime: number;
    matchEndTime: number;
    matchPrice: number;
    playerStatus: PlayerStatus;
    ejectReason?: RemovalReason;
    joinDate: string;
    orderId: string;
    teamCapacity: number;
    playerCnt: number;
}