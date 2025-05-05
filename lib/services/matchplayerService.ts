import { api } from '../api';

export const matchPlayerService = {
    verifyMatch: (params: {matchId: number, amount: number}) => { // 매치 요청
        let endPoint = `/player/verifyMatch?matchId=${params.matchId}&amount=${params.amount}`;
        return api.get<boolean>(endPoint);
    },

    cancelMatch: (params: { matchId: number, reason: string }) => {
        return api.put<{success: boolean, refundId: string}>('/player/cancelMatch', params);
    },
    
    // 결제 취소 상태 확인
    checkCancelStatus: (refundId: string) => {
        return api.get<{status: 'pending' | 'completed' | 'failed', message?: string}>(`/player/cancelStatus?refundId=${refundId}`);
    }
}