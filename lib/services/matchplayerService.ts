import { api } from '../api';
import { RemovalReason } from '../enum/matchEnum';
import { PlayerEject } from '../types/matchTypes';

export const matchPlayerService = {

    // 대시보드 매치 총 이용자 수
    getAdminMatchPlayerCount: (params: {facilityId: number, year: number, month: number}) => {
        let endPoint = `/admin/player/getAdminMatchPlayerCount?facilityId=${params.facilityId}&year=${params.year}&month=${params.month}`;
        return api.get<number>(endPoint);
    },

    // 참가자 퇴장
    ejectPlayer: (params: {playerId: number, ejectRequest: RemovalReason, facilityId: number}) => {
        const ejectRequest: PlayerEject = {
            ejectionReason: params.ejectRequest,
            facilityId: params.facilityId
        }
        console.log(ejectRequest)
        let endPoint = `/admin/player/eject/${params.playerId}`;
        return api.put(endPoint, ejectRequest);
    },

    verifyMatch: (params: {matchId: number, amount: number}) => { // 매치 요청
        let endPoint = `/player/verifyMatch?matchId=${params.matchId}&amount=${params.amount}`;
        return api.get<boolean>(endPoint);
    },

    // 매치 신청 취소
    cancelMatch: (params : {matchId: number, cancelReason: string, orderId: string}) => {
    let endpoint = `/player/cancelMatch`;
    return api.put<string>(endpoint, params);
    },
    
    // 결제 취소 상태 확인
    checkCancelStatus: (refundId: string) => {
        return api.get<{status: 'pending' | 'completed' | 'failed', message?: string}>(`/player/cancelStatus?orderId=${refundId}`);
    }
}