// 스포츠 종류
export enum SportType {
    ALL = "ALL",
    SOCCER = "SOCCER",
    BASKETBALL = "BASKETBALL",
    TENNIS = "TENNIS",
    BADMINTON = "BADMINTON",
    BASEBALL = "BASEBALL",
    FUTSAL = "FUTSAL"
}

// 매치 상태 열거형
export enum MatchStatus {
    FINISH = 'FINISH',
    CLOSE_TO_DEADLINE = 'CLOSE_TO_DEADLINE',
    APPLICABLE = 'APPLICABLE',
    END = 'END'
}