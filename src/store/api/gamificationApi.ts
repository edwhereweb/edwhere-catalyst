import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, unwrapResponse } from './baseQuery';
import type { MobileResponse } from './baseQuery';
import type {
  AppNotification,
  CreateLabInput,
  Dashboard,
  InProgressHub,
  Lab,
  LabFilters,
  Leaderboard,
  LeaderboardPeriod,
  Rewards,
  UpdateProfileInput,
  UserProfile,
  WeeklyTasks,
} from '@/types/gamification';
import type { JobApplication } from '@/types/placement';
import type { DailyResult, DailyState, Squad } from '@/types/engagement';

const unwrap = <T>(response: MobileResponse<T>) => unwrapResponse(response);

export interface LogApplicationInput {
  jobTitle: string;
  company: string;
  role: string;
  type: string;
  location: string;
  url?: string;
  appliedDate: string;
  status: string;
  notes?: string;
  draft?: boolean;
}

export const gamificationApi = createApi({
  reducerPath: 'gamificationApi',
  baseQuery,
  tagTypes: ['Project', 'Dashboard', 'Notification', 'Task', 'Profile', 'Lab', 'Rewards', 'Application', 'Squad', 'Daily'],
  endpoints: (builder) => ({
    getDashboard: builder.query<Dashboard, void>({
      query: () => '/api/mobile/catalyst/dashboard',
      transformResponse: unwrap<Dashboard>,
      providesTags: ['Dashboard'],
    }),
    getInProgress: builder.query<InProgressHub, void>({
      query: () => '/api/mobile/catalyst/progress',
      transformResponse: unwrap<InProgressHub>,
      providesTags: ['Dashboard', 'Task'],
    }),
    getLeaderboard: builder.query<Leaderboard, LeaderboardPeriod>({
      query: (period) => ({ url: '/api/mobile/catalyst/leaderboard', params: { period } }),
      transformResponse: unwrap<Leaderboard>,
    }),
    getNotifications: builder.query<AppNotification[], void>({
      query: () => '/api/mobile/catalyst/notifications',
      transformResponse: unwrap<AppNotification[]>,
      providesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: '/api/mobile/catalyst/notifications/read-all', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    getWeeklyTasks: builder.query<WeeklyTasks, void>({
      query: () => '/api/mobile/catalyst/tasks/weekly',
      transformResponse: unwrap<WeeklyTasks>,
      providesTags: ['Task'],
    }),
    claimWeeklyBonus: builder.mutation<void, void>({
      query: () => ({ url: '/api/mobile/catalyst/tasks/weekly/claim', method: 'POST' }),
      invalidatesTags: ['Task', 'Rewards'],
    }),
    getRewards: builder.query<Rewards, void>({
      query: () => '/api/mobile/catalyst/rewards',
      transformResponse: unwrap<Rewards>,
      providesTags: ['Rewards'],
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => '/api/mobile/catalyst/profile',
      transformResponse: unwrap<UserProfile>,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfileInput>({
      query: (body) => ({ url: '/api/mobile/catalyst/profile', method: 'PATCH', body }),
      transformResponse: unwrap<UserProfile>,
      invalidatesTags: ['Profile', 'Dashboard'],
    }),
    getLabs: builder.query<Lab[], { search: string; filters: LabFilters }>({
      query: ({ search, filters }) => ({
        url: '/api/mobile/catalyst/labs',
        params: {
          search: search || undefined,
          maxHours: filters.maxHours,
          difficulty: filters.difficulties.join(',') || undefined,
          field: filters.fields.join(',') || undefined,
          jobRole: filters.jobRoles.join(',') || undefined,
        },
      }),
      transformResponse: unwrap<Lab[]>,
      providesTags: ['Lab'],
    }),
    getLabById: builder.query<Lab, string>({
      query: (id) => `/api/mobile/catalyst/labs/${encodeURIComponent(id)}`,
      transformResponse: unwrap<Lab>,
      providesTags: ['Lab'],
    }),
    createLab: builder.mutation<Lab, CreateLabInput>({
      query: (body) => ({ url: '/api/mobile/catalyst/labs', method: 'POST', body }),
      transformResponse: unwrap<Lab>,
      invalidatesTags: ['Lab'],
    }),
    submitLabProof: builder.mutation<void, { id: string; flag: string }>({
      query: ({ id, flag }) => ({
        url: `/api/mobile/catalyst/labs/${encodeURIComponent(id)}/submission`,
        method: 'POST',
        body: { flag },
      }),
      invalidatesTags: ['Lab', 'Rewards', 'Dashboard'],
    }),
    logApplication: builder.mutation<JobApplication, LogApplicationInput>({
      query: (body) => ({ url: '/api/mobile/placement/applications/log', method: 'POST', body }),
      invalidatesTags: ['Dashboard', 'Task', 'Application'],
    }),
    getSquad: builder.query<Squad | null, void>({
      query: () => '/api/mobile/catalyst/squad',
      transformResponse: unwrap<Squad | null>,
      providesTags: ['Squad'],
    }),
    createSquad: builder.mutation<Squad, { name: string }>({
      query: (body) => ({ url: '/api/mobile/catalyst/squad', method: 'POST', body }),
      transformResponse: unwrap<Squad>,
      invalidatesTags: ['Squad'],
    }),
    joinSquad: builder.mutation<Squad, { code: string }>({
      query: (body) => ({ url: '/api/mobile/catalyst/squad/join', method: 'POST', body }),
      transformResponse: unwrap<Squad>,
      invalidatesTags: ['Squad'],
    }),
    leaveSquad: builder.mutation<void, void>({
      query: () => ({ url: '/api/mobile/catalyst/squad/leave', method: 'POST' }),
      invalidatesTags: ['Squad'],
    }),
    nudgeSquad: builder.mutation<{ nudged: number }, void>({
      query: () => ({ url: '/api/mobile/catalyst/squad/nudge', method: 'POST' }),
      transformResponse: unwrap<{ nudged: number }>,
    }),
    getDaily: builder.query<DailyState, void>({
      query: () => '/api/mobile/catalyst/daily',
      transformResponse: unwrap<DailyState>,
      providesTags: ['Daily'],
    }),
    submitDaily: builder.mutation<DailyResult, number[]>({
      query: (answers) => ({ url: '/api/mobile/catalyst/daily', method: 'POST', body: { answers } }),
      transformResponse: unwrap<DailyResult>,
      invalidatesTags: ['Daily', 'Dashboard', 'Rewards', 'Squad'],
    }),
    getLoggedApplications: builder.query<JobApplication[], void>({
      query: () => '/api/mobile/catalyst/applications',
      transformResponse: unwrap<JobApplication[]>,
      providesTags: ['Application'],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetInProgressQuery,
  useGetLeaderboardQuery,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useGetWeeklyTasksQuery,
  useClaimWeeklyBonusMutation,
  useGetRewardsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetLabsQuery,
  useGetLabByIdQuery,
  useCreateLabMutation,
  useSubmitLabProofMutation,
  useLogApplicationMutation,
  useGetLoggedApplicationsQuery,
  useGetSquadQuery,
  useCreateSquadMutation,
  useJoinSquadMutation,
  useLeaveSquadMutation,
  useNudgeSquadMutation,
  useGetDailyQuery,
  useSubmitDailyMutation,
} = gamificationApi;
