import { api } from '../api';

export const matchPlayerService = {
    verifyMatch: (params: {matchId: number, amount: number}) => { // 매치 요청
        let endPoint = `/player/verifyMatch?matchId=${params.matchId}&amount=${params.amount}`;
        return api.get<boolean>(endPoint);
    }
}