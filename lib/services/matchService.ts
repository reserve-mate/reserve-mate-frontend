import { api } from '../api';
import { FacilityManager } from './userService';

// 스포츠 종류
export enum SportType {
  SOCCER,
  BASKETBALL,
  TENNIS,
  BADMINTON,
  BASEBALL,
  FUTSAL
}

// 매치 상태 열거형
export enum MatchStatus {
  RECRUITING = '모집중',
  CLOSED = '마감',
  COMPLETED = '종료',
  CANCELED = '취소'
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

// 날짜별 매치 개수
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

// 매치 서비스
export const matchService = {
  // 매치 목록 조회
  getMatches: (params: MatchSearch) => {
    let endpoint = '/match/matches';
    console.log(params)
    
    return api.post<Match[]>(endpoint, { params: params});
  },

  // 매치 날짜별 조회
  getMatchDates: (params: MatchSearch) => {
    let endpoint = "/match/matcheDates";

    return api.post<MathDateCount[]>(endpoint, {params});
  },
  
  // 관리자용 매치 목록 조회
  getAdminMatches: () => 
    api.get<Match[]>('/admin/matches'),
  
  // 매치 상세 조회
  getMatch: (id: number) => 
    api.get<Match>(`/matches/${id}`),
  
  // 매치 생성 (관리자 전용)
  createMatch: (data: CreateMatchRequest) => {
    const formData = new FormData();
    
    // JSON 데이터를 FormData에 추가
    formData.append('matchData', JSON.stringify({
      title: data.title,
      sportType: data.sportType,
      facilityId: data.facilityId,
      matchDate: data.matchDate,
      matchTime: `${data.startTime} - ${data.endTime}`,
      maxParticipants: data.maxParticipants,
      fee: data.fee,
      description: data.description,
      equipmentProvided: data.equipmentProvided,
      courtId: data.courtId,
      managerId: data.managerId
    }));
    
    // 이미지 파일 추가
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append(`images`, image);
      });
    }
    
    return api.post<Match>('/admin/matches', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 매치 수정 (관리자 전용)
  updateMatch: (id: number, data: Partial<Match>) => 
    api.put<Match>(`/admin/matches/${id}`, data),
  
  // 매치 상태 변경 (관리자 전용)
  updateMatchStatus: (id: number, status: MatchStatus) => 
    api.patch<Match>(`/admin/matches/${id}/status`, { status }),
  
  // 매치 삭제 (관리자 전용)
  deleteMatch: (id: number) => 
    api.delete(`/admin/matches/${id}`),
    
  // 시설의 매니저 목록 조회
  getFacilityManagers: (facilityId: number) => 
    api.get<FacilityManager[]>(`/admin/facilities/${facilityId}/managers`),
}; 