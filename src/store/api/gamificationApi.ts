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
  tagTypes: ['Dashboard', 'Notification', 'Task', 'Profile', 'Lab', 'Rewards'],
  endpoints: (builder) => ({
    getDashboard: builder.query<Dashboard, void>({
      query: () => '/api/mobile/dashboard',
      transformResponse: unwrap<Dashboard>,
      providesTags: ['Dashboard'],
    }),
    getInProgress: builder.query<InProgressHub, void>({
      query: () => '/api/mobile/progress',
      transformResponse: unwrap<InProgressHub>,
      providesTags: ['Dashboard', 'Task'],
    }),
    getLeaderboard: builder.query<Leaderboard, LeaderboardPeriod>({
      query: (period) => ({ url: '/api/mobile/leaderboard', params: { period } }),
      transformResponse: unwrap<Leaderboard>,
    }),
    getNotifications: builder.query<AppNotification[], void>({
      query: () => '/api/mobile/notifications',
      transformResponse: unwrap<AppNotification[]>,
      providesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: '/api/mobile/notifications/read-all', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    getWeeklyTasks: builder.query<WeeklyTasks, void>({
      query: () => '/api/mobile/tasks/weekly',
      transformResponse: unwrap<WeeklyTasks>,
      providesTags: ['Task'],
    }),
    claimWeeklyBonus: builder.mutation<void, void>({
      query: () => ({ url: '/api/mobile/tasks/weekly/claim', method: 'POST' }),
      invalidatesTags: ['Task', 'Rewards'],
    }),
    getRewards: builder.query<Rewards, void>({
      query: () => '/api/mobile/rewards',
      transformResponse: unwrap<Rewards>,
      providesTags: ['Rewards'],
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => '/api/mobile/profile',
      transformResponse: unwrap<UserProfile>,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfileInput>({
      query: (body) => ({ url: '/api/mobile/profile', method: 'PATCH', body }),
      transformResponse: unwrap<UserProfile>,
      invalidatesTags: ['Profile'],
    }),
    getLabs: builder.query<Lab[], { search: string; filters: LabFilters }>({
      query: ({ search, filters }) => ({
        url: '/api/mobile/labs',
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
      query: (id) => `/api/mobile/labs/${encodeURIComponent(id)}`,
      transformResponse: unwrap<Lab>,
      providesTags: ['Lab'],
    }),
    createLab: builder.mutation<Lab, CreateLabInput>({
      query: (body) => ({ url: '/api/mobile/labs', method: 'POST', body }),
      transformResponse: unwrap<Lab>,
      invalidatesTags: ['Lab'],
    }),
    submitLabProof: builder.mutation<void, { id: string; flag: string }>({
      query: ({ id, flag }) => ({
        url: `/api/mobile/labs/${encodeURIComponent(id)}/submission`,
        method: 'POST',
        body: { flag },
      }),
      invalidatesTags: ['Lab', 'Rewards', 'Dashboard'],
    }),
    logApplication: builder.mutation<JobApplication, LogApplicationInput>({
      query: (body) => ({ url: '/api/mobile/placement/applications/log', method: 'POST', body }),
      invalidatesTags: ['Dashboard', 'Task'],
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
} = gamificationApi;
