import type { StageState } from '@/types/projects';

export const STATE_BADGE: Record<
  StageState,
  { label: string; variant: 'default' | 'warning' | 'success' | 'destructive' | 'info' }
> = {
  locked: { label: 'Locked', variant: 'default' },
  open: { label: 'Open', variant: 'info' },
  draft: { label: 'Draft', variant: 'info' },
  submitted: { label: 'In review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  changes_requested: { label: 'Needs changes', variant: 'destructive' },
};

/** Stages a student may still edit. */
export const EDITABLE: StageState[] = ['open', 'draft', 'changes_requested'];
