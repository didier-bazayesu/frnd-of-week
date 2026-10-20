export interface MatchPair {
  /** The participant who is being matched. */
  participantId: string;
  /** The matched friend's participant ID. */
  friendId: string;
}

export interface WeeklyMatches {
  /** ISO-week identifier, e.g. "2024-W42". */
  weekId: string;
  pairs: MatchPair[];
  generatedAt: string;
}

export interface MatchResult {
  participantId: string;
  friendId: string;
}
