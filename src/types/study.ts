export interface StudyTrack {
  id: string;
  slug: string;
  title: string;
  description: string;
  topicCount: number;
  totalMinutes: number;
}

export interface StudyTopicSummary {
  id: string;
  title: string;
  moduleTitle: string;
  estMinutes: number;
  done: boolean;
  subtopicCount: number;
  cardCount: number;
  questionCount: number;
}

export interface StudyPlan {
  track: { id: string; title: string };
  totalDays: number;
  dayNumber: number;
  daysLeft: number;
  topicsDone: number;
  topicsTotal: number;
  percentComplete: number;
  today: StudyTopicSummary[];
  dayComplete: boolean;
  nextUp?: StudyTopicSummary;
}

export interface StudyPlanRequest {
  track: { id: string; title: string };
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

/** `plan` exists only once a teacher has approved the student's request. */
export interface StudyPlanState {
  plan: StudyPlan | null;
  request: StudyPlanRequest | null;
}

export interface StudyRoadmap {
  track: { id: string; title: string };
  modules: {
    id: string;
    title: string;
    description: string;
    topics: (StudyTopicSummary & { subtopics: string[] })[];
  }[];
}

export interface StudyTopic {
  id: string;
  title: string;
  moduleTitle: string;
  estMinutes: number;
  subtopics: string[];
  cards: { front: string; back: string }[];
  questions: { question: string; options: string[]; company?: string }[];
  done: boolean;
  bestScore?: number;
}

export interface QuizResult {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  passMark: number;
  results: { correct: boolean; correctIndex: number; explanation: string }[];
}
