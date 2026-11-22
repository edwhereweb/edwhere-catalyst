import { gamificationApi } from './gamificationApi';
import { unwrapResponse, type MobileResponse } from './baseQuery';
import type { ProjectDetail, ProjectSummary, SaveStageInput } from '@/types/projects';

const unwrap = <T>(response: MobileResponse<T>) => unwrapResponse(response);

export const projectsApi = gamificationApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectSummary[], void>({
      query: () => '/api/mobile/catalyst/projects',
      transformResponse: unwrap<ProjectSummary[]>,
      providesTags: ['Project'],
    }),
    getProject: builder.query<ProjectDetail, string>({
      query: (id) => `/api/mobile/catalyst/projects/${encodeURIComponent(id)}`,
      transformResponse: unwrap<ProjectDetail>,
      providesTags: ['Project'],
    }),
    saveProjectStage: builder.mutation<{ status: string }, SaveStageInput>({
      query: ({ projectId, stageId, ...body }) => ({
        url: `/api/mobile/catalyst/projects/${encodeURIComponent(projectId)}/stages/${encodeURIComponent(stageId)}/submission`,
        method: 'POST',
        body,
      }),
      transformResponse: unwrap<{ status: string }>,
      invalidatesTags: ['Project'],
    }),
  }),
});

export const { useGetProjectsQuery, useGetProjectQuery, useSaveProjectStageMutation } = projectsApi;
