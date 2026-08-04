import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Job, JobApplication, PlacementAccessStatus, BulkPlacementAccessPayload } from '@/types/placement';

export const placementApi = createApi({
  reducerPath: 'placementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.edwhere.com/v1',
    prepareHeaders: (headers, { getState }) => {
      // Token is injected via Clerk's tokenAccessor.
      // In production, use a Clerk-aware baseQuery wrapper that calls getToken().
      const token = (getState() as { auth?: { token?: string } }).auth?.token;
      if (token) {
        headers.set('Authorization', ['Bearer', token].join(' '));
      }
      return headers;
    },
  }),
  tagTypes: ['Job', 'Application', 'PlacementAccess'],
  endpoints: (builder) => ({
    // ── Job Listings ──────────────────────────────────────────────────────────
    getJobs: builder.query<Job[], { search?: string; type?: string; location?: string }>({
      query: (params) => ({
        url: '/placement/jobs',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Job' as const, id })),
              { type: 'Job', id: 'LIST' },
            ]
          : [{ type: 'Job', id: 'LIST' }],
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `/placement/jobs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),

    bookmarkJob: builder.mutation<void, { jobId: string; bookmarked: boolean }>({
      query: ({ jobId, bookmarked }) => ({
        url: `/placement/jobs/${jobId}/bookmark`,
        method: 'PATCH',
        body: { bookmarked },
      }),
      invalidatesTags: (_result, _error, { jobId }) => [{ type: 'Job', id: jobId }],
    }),

    // ── Applications ──────────────────────────────────────────────────────────
    getMyApplications: builder.query<JobApplication[], void>({
      query: () => '/placement/applications',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Application' as const, id })),
              { type: 'Application', id: 'LIST' },
            ]
          : [{ type: 'Application', id: 'LIST' }],
    }),

    applyForJob: builder.mutation<JobApplication, { jobId: string; notes?: string }>({
      query: (body) => ({
        url: '/placement/applications',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Application', id: 'LIST' }],
    }),

    updateApplicationStatus: builder.mutation<
      JobApplication,
      { applicationId: string; status: JobApplication['status']; notes?: string }
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/placement/applications/${applicationId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: 'Application', id: applicationId },
      ],
    }),

    // ── Placement Access (student-facing, reads own flag) ─────────────────────
    getMyPlacementAccess: builder.query<PlacementAccessStatus, void>({
      query: () => '/placement/access/me',
      providesTags: [{ type: 'PlacementAccess', id: 'ME' }],
    }),

    // ── Admin: Manage student placement access ────────────────────────────────
    setStudentPlacementAccess: builder.mutation<
      void,
      { studentId: string; grant: boolean }
    >({
      query: ({ studentId, grant }) => ({
        url: `/admin/students/${studentId}/placement-access`,
        method: 'PATCH',
        body: { hasPlacementAccess: grant },
      }),
      invalidatesTags: [{ type: 'PlacementAccess', id: 'ME' }],
    }),

    bulkSetPlacementAccess: builder.mutation<void, BulkPlacementAccessPayload>({
      query: (body) => ({
        url: '/admin/students/bulk-placement-access',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'PlacementAccess', id: 'ME' }],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useBookmarkJobMutation,
  useGetMyApplicationsQuery,
  useApplyForJobMutation,
  useUpdateApplicationStatusMutation,
  useGetMyPlacementAccessQuery,
  useSetStudentPlacementAccessMutation,
  useBulkSetPlacementAccessMutation,
} = placementApi;
