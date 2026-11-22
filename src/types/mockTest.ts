export interface MockQuestion {
  question: string;
  /** Optional code snippet shown in monospace under the question. */
  code?: string;
  options: string[];
  /** Used for the weak-topic breakdown in the report. */
  topic: string;
}

export interface MockSection {
  key: string;
  title: string;
  minutes: number;
  questions: MockQuestion[];
}

export interface CodingProblem {
  key: string;
  title: string;
  difficulty: string;
  statement: string;
  examples: { input: string; output: string }[];
  constraints: string[];
}

/** The test as the phone gets it: no answer key until the attempt is submitted. */
export interface MockTest {
  id: string;
  company: string;
  title: string;
  description: string;
  /** What the real process looks like, as reported by candidates. */
  pattern: string[];
  sections: MockSection[];
  coding: { minutes: number; problems: CodingProblem[] };
}

export interface MockTestSummary {
  id: string;
  company: string;
  title: string;
  description: string;
  mcqCount: number;
  codingCount: number;
  totalMinutes: number;
  attempts: number;
  bestPercent: number | null;
}

export type CodingStatus = 'none' | 'partial' | 'solved';

export interface MockAttemptInput {
  sections: { key: string; answers: number[]; seconds: number }[];
  coding: { key: string; status: CodingStatus }[];
  codingSeconds: number;
}

export interface MockAttemptResult {
  attemptId: string;
  score: number;
  total: number;
  totalSeconds: number;
  sections: {
    key: string;
    correct: number;
    total: number;
    seconds: number;
    review: { correctIndex: number; explanation: string }[];
  }[];
  coding: { key: string; approach: string }[];
}
