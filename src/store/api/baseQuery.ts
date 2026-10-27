import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getClerkToken } from '@/services/authToken';

export interface MobileResponse<T> {
  data: T;
  meta?: unknown;
}

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl ? `${apiBaseUrl}/` : '',
  prepareHeaders: async (headers) => {
    const token = await getClerkToken();
    if (token) headers.set('Authorization', ['Bearer', token].join(' '));
    headers.set('X-API-Version', '1');
    return headers;
  },
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = (
  args,
  api,
  extraOptions,
) => {
  if (!apiBaseUrl) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: 'Set EXPO_PUBLIC_API_BASE_URL to the Edwhere LMS origin.',
      },
    };
  }

  return rawBaseQuery(args, api, extraOptions);
};

export function unwrapResponse<T>(response: MobileResponse<T>): T {
  if (!response || !Object.prototype.hasOwnProperty.call(response, 'data')) {
    throw new Error('The server returned an invalid response.');
  }
  return response.data;
}
