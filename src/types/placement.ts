export type ApplicationStatus =
  | 'applied'
  | 'interviewing'
  | 'shortlisted'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance';

export type JobLocation = 'remote' | 'onsite' | 'hybrid';

export interface JobTag {
  label: string;
  variant: 'primary' | 'secondary' | 'tertiary';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  locationType: JobLocation;
  salary?: string;
  type: JobType;
  tags: JobTag[];
  postedAt: string; // ISO date string
  description?: string;
  responsibilities?: string[];
  requirements?: {
    label: string;
    description: string;
    icon: string;
  }[];
  careerMatchPercent?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogoUrl?: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  notes?: string;
}
