import { api } from '../api';
import { MatchStatus } from '../enum/matchEnum';
import { ApiError, ApiResonse, Slice } from '../types/commonTypes';
import { AdminMatchDetail, AdminMatches, AdminMatchSearch, CreateMatchRequest, Match, MatchDetailRespone, MatchHistory, MatchHistoryResponse, MatchList, MatchRegist, MatchSearch, MathDateCount } from '../types/matchTypes';
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
    let endPoint = `/admin/match/registMatch`
    return api.post(endPoint, params);
  },

  // 매치 상태 변경(관리자 전용)
  updateMatchStat: (params: {matchId: number, matchStatus: MatchStatus}) => {
    let endPoint = `/admin/match/status/${params.matchId}?status=${params.matchStatus}`;
    return api.put(endPoint);
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

  // 매치 이용 내역
  getMatchHistory: (params: {matchStatus: string, pageNum: number}) => {
    let endPoint = `/match/matchHistory?matchStatus=${params.matchStatus}&pageNum=${params.pageNum}`;
    return api.get<Slice<MatchHistoryResponse>>(endPoint);
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
  updateMatch: (matchid: number, data: Record<string, any>) => {
    return api.put(`/admin/match/edit/${matchid}`, data)
  },
  
  // 매치 상태 변경 (관리자 전용)
  updateMatchStatus: (id: number, status: MatchStatus) => 
    api.patch<Match>(`/admin/matches/${id}/status`, { status }),
  
  // 시설의 매니저 목록 조회
  getFacilityManagers: (facilityId: number) => 
    api.get<FacilityManager[]>(`/admin/facilities/${facilityId}/managers`),

}; 