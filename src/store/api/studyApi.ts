import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, unwrapResponse } from './baseQuery';
import type { MobileResponse } from './baseQuery';
import { gamificationApi } from './gamificationApi';
import type {
  QuizResult,
  StudyPlanState,
  StudyRoadmap,
  StudyTopic,
  StudyTrack,
} from '@/types/study';

const unwrap = <T>(response: MobileResponse<T>) => unwrapResponse(response);

export const studyApi = createApi({
  reducerPath: 'studyApi',
  baseQuery,
  tagTypes: ['Plan', 'Topic'],
  endpoints: (builder) => ({
    getStudyTracks: builder.query<StudyTrack[], void>({
      query: () => '/api/mobile/catalyst/study/tracks',
      transformResponse: unwrap<StudyTrack[]>,
    }),
    getStudyPlan: builder.query<StudyPlanState, void>({
      query: () => '/api/mobile/catalyst/study/plan',
      transformResponse: unwrap<StudyPlanState>,
      providesTags: ['Plan'],
    }),
    requestStudyPlan: builder.mutation<StudyPlanState, { trackId: string; days: number }>({
      query: (body) => ({ url: '/api/mobile/catalyst/study/plan', method: 'POST', body }),
      transformResponse: unwrap<StudyPlanState>,
      invalidatesTags: ['Plan', 'Topic'],
    }),
    getStudyRoadmap: builder.query<StudyRoadmap | null, void>({
      query: () => '/api/mobile/catalyst/study/roadmap',
      transformResponse: unwrap<StudyRoadmap | null>,
      providesTags: ['Plan'],
    }),
    getStudyTopic: builder.query<StudyTopic, string>({
      query: (id) => `/api/mobile/catalyst/study/topics/${encodeURIComponent(id)}`,
      transformResponse: unwrap<StudyTopic>,
      providesTags: (_r, _e, id) => [{ type: 'Topic', id }],
    }),
    submitStudyQuiz: builder.mutation<QuizResult, { topicId: string; answers: number[] }>({
      query: ({ topicId, answers }) => ({
        url: `/api/mobile/catalyst/study/topics/${encodeURIComponent(topicId)}/quiz`,
        method: 'POST',
        body: { answers },
      }),
      transformResponse: unwrap<QuizResult>,
      invalidatesTags: (_r, _e, { topicId }) => ['Plan', { type: 'Topic', id: topicId }],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(gamificationApi.util.invalidateTags(['Dashboard', 'Rewards']));
      },
    }),
    completeStudyTopic: builder.mutation<void, string>({
      query: (topicId) => ({
        url: `/api/mobile/catalyst/study/topics/${encodeURIComponent(topicId)}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => ['Plan', { type: 'Topic', id }],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(gamificationApi.util.invalidateTags(['Dashboard', 'Rewards']));
      },
    }),
  }),
});

export const {
  useGetStudyTracksQuery,
  useGetStudyPlanQuery,
  useRequestStudyPlanMutation,
  useGetStudyRoadmapQuery,
  useGetStudyTopicQuery,
  useSubmitStudyQuizMutation,
  useCompleteStudyTopicMutation,
} = studyApi;
