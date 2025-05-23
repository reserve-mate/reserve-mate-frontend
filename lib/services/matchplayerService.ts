import { api } from '../api';
import { RemovalReason } from '../enum/matchEnum';
import { PlayerEject } from '../types/matchTypes';

export const matchPlayerService = {

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