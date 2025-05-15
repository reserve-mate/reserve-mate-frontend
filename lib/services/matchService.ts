import { api } from '../api';
import { MatchStatus } from '../enum/matchEnum';
import { ApiError, ApiResonse, Slice } from '../types/commonTypes';
import { AdminMatchDetail, AdminMatches, AdminMatchSearch, CreateMatchRequest, Match, MatchDetailRespone, MatchList, MatchRegist, MatchSearch, MathDateCount } from '../types/matchTypes';
import { FacilityManager } from './userService';

// 매치 서비스
export const matchService = {

  // 관리자 매치 조회(관리자 전용)
  adminGetMatches: (params: AdminMatchSearch) => {
    let endPoint = `/admin/match/getMatches`;
    return api.post<Slice<AdminMatches>>(endPoint, params);
  },

  // 매치 등록(관리자 전용)
  registMatch: (params: MatchRegist) => {
    let endPoint = `/match/registMatch`
    return api.post(endPoint, params);
  },

  // 매치 삭제(관리자 전용)
  deleteMatch: (matchId: number) => {
    let endPoint = `/admin/match/delete/${matchId}`;
    return api.post(endPoint);
  },

  // 매치 상세 조회(관리자 전용)
  getAdminMatch: (matchId: number) => {
    let endPoint = `/admin/match/${matchId}`;
    return api.get<AdminMatchDetail>(endPoint);
  },

  // 매치 목록 조회
  getMatches: (params: MatchSearch) => {
    let endpoint = '/match/matches';
    
    return api.post<Slice<MatchList>>(endpoint, params);
  },

  // 매치 날짜별 조회
  getMatchDates: (params: MatchSearch) => {
    let endpoint = "/match/matcheDates";

    return api.post<MathDateCount[]>(endpoint, params);
  },

  // 매치 상세 조회
  getMatch: (matchId: number) => {
    return api.get<MatchDetailRespone>(`/match/matches/${matchId}`)
  },

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
  // deleteMatch: (id: number) => 
  //   api.delete(`/admin/matches/${id}`),
    
  // 시설의 매니저 목록 조회
  getFacilityManagers: (facilityId: number) => 
    api.get<FacilityManager[]>(`/admin/facilities/${facilityId}/managers`),
}; 