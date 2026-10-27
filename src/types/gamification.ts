export type LabDifficulty = 'easy' | 'medium' | 'hard';

export interface Lab {
  id: string;
  title: string;
  field: string;
  difficulty: LabDifficulty;
  hours: number;
  points: number;
  description: string;
  tags: string[];
  environment?: string;
  objectives?: string[];
  targetVm?: string;
  tools?: string;
  network?: string;
  submissionStatus?: 'pending' | 'submitted' | 'approved';
}

export interface LabFilters {
  maxHours: number;
  difficulties: LabDifficulty[];
  fields: string[];
  jobRoles: string[];
}

export interface CreateLabInput {
  name: string;
  description: string;
  field: string;
  hours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructionsFileName?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  title?: string;
  points: number;
  isCurrentUser: boolean;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'all-time';

export interface Leaderboard {
  entries: LeaderboardEntry[];
  me?: LeaderboardEntry & { league?: string; streak: number };
}

export type NotificationCategory = 'alerts' | 'achievements' | 'social';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface WeeklyTask {
  id: string;
  title: string;
  category?: string;
  dueLabel: string;
  points: number;
  status: TaskStatus;
  priority: boolean;
  note?: string;
}

export interface WeeklyTasks {
  weekLabel: string;
  completionPercent: number;
  projectedPoints: number;
  tasks: WeeklyTask[];
}

export interface Badge {
  id: string;
  name: string;
  unlocked: boolean;
}

export interface RewardHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  occurredAt: string;
}

export interface Rewards {
  streak: number;
  totalPoints: number;
  activeDays: boolean[];
  weeklyCompletionPercent: number;
  badges: Badge[];
  history: RewardHistoryItem[];
}

export interface Dashboard {
  firstName: string;
  streak: number;
  weeklyApplications: { done: number; target: number };
  skillHours: { done: number; target: number };
  rank?: number;
  careerSetup: { label: string; state: 'done' | 'now' | 'pending' }[];
  event?: { title: string; description: string };
}

export interface InProgressHub {
  lastUpdated: string;
  remainingTasks: number;
  draftLab?: { id: string; title: string };
  activeApplication?: { id: string; title: string };
  hoursInvested: number;
  hoursChangePercent: number;
  tasksCompleted: number;
  tasksTarget: number;
}

export interface UserProfile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  points: number;
  streak: number;
  badges: string[];
  skills: string[];
  certifications: { name: string; credentialId: string; url?: string }[];
  targetRoles: string[];
  workPreference: 'remote' | 'hybrid';
  resumeName?: string;
}

export type UpdateProfileInput = Pick<
  UserProfile,
  'name' | 'bio' | 'targetRoles' | 'skills' | 'workPreference' | 'resumeName'
>;
