import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, unwrapResponse } from './baseQuery';
import type { MobileResponse } from './baseQuery';
import type { MockAttemptInput, MockAttemptResult, MockTest, MockTestSummary } from '@/types/mockTest';

const unwrap = <T>(response: MobileResponse<T>) => unwrapResponse(response);

export const mockTestApi = createApi({
  reducerPath: 'mockTestApi',
  baseQuery,
  tagTypes: ['MockTests'],
  endpoints: (builder) => ({
    getMockTests: builder.query<MockTestSummary[], void>({
      query: () => '/api/mobile/catalyst/mock-tests',
      transformResponse: unwrap<MockTestSummary[]>,
      providesTags: ['MockTests'],
    }),
    getMockTest: builder.query<MockTest, string>({
      query: (id) => `/api/mobile/catalyst/mock-tests/${encodeURIComponent(id)}`,
      transformResponse: unwrap<MockTest>,
    }),
    submitMockAttempt: builder.mutation<MockAttemptResult, { testId: string; body: MockAttemptInput }>({
      query: ({ testId, body }) => ({
        url: `/api/mobile/catalyst/mock-tests/${encodeURIComponent(testId)}/attempts`,
        method: 'POST',
        body,
      }),
      transformResponse: unwrap<MockAttemptResult>,
      invalidatesTags: ['MockTests'],
    }),
  }),
});

export const { useGetMockTestsQuery, useGetMockTestQuery, useSubmitMockAttemptMutation } = mockTestApi;
