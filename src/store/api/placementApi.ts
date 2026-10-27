import { createApi } from '@reduxjs/toolkit/query/react';
import type { Job, JobApplication, JobType, ApplicationStatus } from '@/types/placement';
import { baseQuery, unwrapResponse } from './baseQuery';
import type { MobileResponse } from './baseQuery';

interface ApiJob extends Record<string, unknown> {
  id: string;
}

interface ApiApplication extends Record<string, unknown> {
  id: string;
}

interface PlacementProfile extends Record<string, unknown> {
  isActive?: boolean;
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
}

function getCompany(job: ApiJob) {
  const company = job.company;
  if (typeof company === 'string') return { name: company };
  if (company && typeof company === 'object') {
    const value = company as Record<string, unknown>;
    return {
      name: stringValue(value.name, 'Company'),
      logoUrl: stringValue(value.logoUrl) || undefined,
    };
  }
  return { name: 'Company' };
}

function normalizeJobType(value: unknown): JobType {
  const normalized = stringValue(value, 'full-time').toLowerCase().replace(/_/g, '-');
  const types: JobType[] = ['full-time', 'part-time', 'internship', 'contract', 'freelance'];
  return types.includes(normalized as JobType) ? (normalized as JobType) : 'full-time';
}

function mapJob(value: ApiJob): Job {
  const company = getCompany(value);
  const rawTags = Array.isArray(value.tags) ? value.tags : Array.isArray(value.skills) ? value.skills : [];
  const tags = rawTags.flatMap((tag) => {
    if (typeof tag === 'string') return [{ label: tag, variant: 'primary' as const }];
    if (tag && typeof tag === 'object' && typeof (tag as Record<string, unknown>).label === 'string') {
      const item = tag as Record<string, unknown>;
      const variant = item.variant;
      return [{
        label: stringValue(item.label),
        variant: (variant === 'secondary' || variant === 'tertiary'
          ? variant
          : 'primary') as Job['tags'][number]['variant'],
      }];
    }
    return [];
  });
  const rawRequirements = Array.isArray(value.requirements) ? value.requirements : [];
  const requirements = rawRequirements.flatMap((requirement) => {
    if (!requirement || typeof requirement !== 'object') return [];
    const item = requirement as Record<string, unknown>;
    if (typeof item.label !== 'string') return [];
    return [{
      label: item.label,
      description: stringValue(item.description),
      icon: stringValue(item.icon, '•'),
    }];
  });
  const locationType = stringValue(value.locationType, 'onsite').toLowerCase();

  return {
    id: value.id,
    title: stringValue(value.title, 'Untitled role'),
    company: company.name,
    companyLogoUrl: company.logoUrl,
    location: stringValue(value.location, 'Location not specified'),
    locationType: locationType === 'remote' || locationType === 'hybrid' ? locationType : 'onsite',
    salary: stringValue(value.salary ?? value.salaryRange ?? value.salaryMin),
    type: normalizeJobType(value.type),
    tags,
    postedAt: stringValue(value.postedAt ?? value.createdAt),
    description: stringValue(value.description) || undefined,
    responsibilities: Array.isArray(value.responsibilities)
      ? value.responsibilities.filter((item): item is string => typeof item === 'string')
      : undefined,
    requirements,
    careerMatchPercent: typeof value.careerMatchPercent === 'number' ? value.careerMatchPercent : undefined,
  };
}

function normalizeApplicationStatus(value: unknown): ApplicationStatus {
  const status = stringValue(value, 'applied').toLowerCase();
  if (status === 'pending' || status === 'applied') return 'applied';
  if (status === 'interview' || status === 'interviewing') return 'interviewing';
  if (status === 'shortlisted') return 'shortlisted';
  if (status === 'offer' || status === 'offered' || status === 'accepted') return 'offer';
  if (status === 'rejected') return 'rejected';
  if (status === 'withdrawn') return 'withdrawn';
  return 'applied';
}

function mapApplication(value: ApiApplication): JobApplication {
  const job = value.job && typeof value.job === 'object'
    ? value.job as Record<string, unknown>
    : undefined;
  const company = job ? getCompany(job as ApiJob).name : stringValue(value.company, 'Company');

  return {
    id: value.id,
    jobId: stringValue(value.jobId ?? job?.id),
    jobTitle: stringValue(job?.title ?? value.jobTitle, 'Untitled role'),
    company,
    status: normalizeApplicationStatus(value.status),
    appliedAt: stringValue(value.appliedAt),
    updatedAt: stringValue(value.updatedAt ?? value.appliedAt),
    notes: stringValue(value.note ?? value.notes) || undefined,
  };
}

export const placementApi = createApi({
  reducerPath: 'placementApi',
  baseQuery,
  tagTypes: ['Job', 'Application', 'PlacementProfile'],
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], { search?: string; type?: string }>({
      query: (params) => ({
        url: '/api/mobile/placement/jobs',
        params,
      }),
      transformResponse: (response: MobileResponse<ApiJob[]>) =>
        unwrapResponse(response).map(mapJob),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Job' as const, id })),
              { type: 'Job', id: 'LIST' },
            ]
          : [{ type: 'Job', id: 'LIST' }],
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `/api/mobile/placement/jobs/${encodeURIComponent(id)}`,
      transformResponse: (response: MobileResponse<ApiJob>) => mapJob(unwrapResponse(response)),
      providesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),

    getMyApplications: builder.query<JobApplication[], void>({
      query: () => '/api/mobile/placement/applications',
      transformResponse: (response: MobileResponse<ApiApplication[]>) =>
        unwrapResponse(response).map(mapApplication),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Application' as const, id })),
              { type: 'Application', id: 'LIST' },
            ]
          : [{ type: 'Application', id: 'LIST' }],
    }),

    applyForJob: builder.mutation<JobApplication, { jobId: string; note?: string }>({
      query: (body) => ({
        url: '/api/mobile/placement/applications',
        method: 'POST',
        body,
      }),
      transformResponse: (response: MobileResponse<ApiApplication>) =>
        mapApplication(unwrapResponse(response)),
      invalidatesTags: [{ type: 'Application', id: 'LIST' }],
    }),

    getPlacementProfile: builder.query<PlacementProfile, void>({
      query: () => '/api/mobile/placement/profile',
      transformResponse: (response: MobileResponse<PlacementProfile>) => unwrapResponse(response),
      providesTags: [{ type: 'PlacementProfile', id: 'ME' }],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useGetMyApplicationsQuery,
  useApplyForJobMutation,
  useGetPlacementProfileQuery,
} = placementApi;
