export interface SquadMember {
  userId: string;
  name: string;
  isLeader: boolean;
  isMe: boolean;
  points: number;
  streak: number;
  weekPoints: number;
  activeToday: boolean;
  lastActiveAt?: string;
}

export interface Squad {
  id: string;
  name: string;
  /** Six characters other students type to join. */
  code: string;
  maxSize: number;
  isLeader: boolean;
  /** Days in a row on which at least half the squad earned points. */
  streak: number;
  activeToday: number;
  members: SquadMember[];
}

export interface DailyQuestion {
  topicTitle: string;
  question: string;
  options: string[];
  company?: string;
}

export type DailyState =
  | { dayKey: string; done: true; score: number; total: number }
  | { dayKey: string; done: false; questions: DailyQuestion[] };

export interface DailyResult {
  score: number;
  total: number;
  xp: number;
  results: { correct: boolean; correctIndex: number; explanation: string }[];
}
