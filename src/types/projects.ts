export type StageState =
  | 'locked'
  | 'open'
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'changes_requested';

export interface RubricItem {
  id: string;
  label: string;
  maxPoints: number;
}

export interface ProjectAttachment {
  url: string;
  name: string;
  description: string;
  /** 1 for the original submission, higher for files added after the instructor asked for changes. */
  round: number;
}

export interface StageSubmission {
  text: string | null;
  attachments: ProjectAttachment[];
  revision: number;
  studentNote: string | null;
  status: string;
  score: number | null;
  feedback: string | null;
  rubricScores: { criterionId: string; score: number }[];
}

export interface ProjectStage {
  id: string;
  order: number;
  title: string;
  points: number;
  state: StageState;
  /** Empty while the stage is locked. */
  instructions: string;
  inputType: 'text' | 'file';
  minWords: number | null;
  maxWords: number | null;
  maxFiles: number;
  rubric: RubricItem[];
  submission: StageSubmission | null;
}

export interface ProjectSummary {
  id: string;
  title: string;
  field: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  stageCount: number;
  approvedCount: number;
  totalPoints: number;
  earnedPoints: number;
}

export interface ProjectDetail {
  id: string;
  title: string;
  field: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  totalPoints: number;
  earnedPoints: number;
  approvedCount: number;
  stages: ProjectStage[];
}

export interface SaveStageInput {
  projectId: string;
  stageId: string;
  text?: string;
  attachments?: Pick<ProjectAttachment, 'url' | 'name' | 'description'>[];
  studentNote?: string;
  submit: boolean;
}
