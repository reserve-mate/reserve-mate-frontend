// 스포츠 종류
export enum SportType {
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
    END = 'END',
    ONGOING = 'ONGOING',
    CANCELLED = 'CANCELLED'
}
export enum EjectReason {
    LATE = "LATE",
    ABUSIVE_BEHAVIOR = "ABUSIVE_BEHAVIOR",
    SERIOUS_RULE_VIOLATION = "SERIOUS_RULE_VIOLATION"
}

// 플레이어 상태
export enum PlayerStatus {
    READY = "READY",
    CANCEL = "CANCEL",
    COMPLETED = "COMPLETED",
    MATCH_CANCELLED = "MATCH_CANCELLED",
    KICKED = "KICKED",
    ONGOING = "ONGOING"
}

// 참가자 퇴장 사유 열거형
export enum RemovalReason {
    LATE = 'LATE',                        // 지각
    ABUSIVE_BEHAVIOR = 'ABUSIVE_BEHAVIOR',          // 폭언/비매너
    SERIOUS_RULE_VIOLATION = 'SERIOUS_RULE_VIOLATION'    // 심각한 룰위반

}