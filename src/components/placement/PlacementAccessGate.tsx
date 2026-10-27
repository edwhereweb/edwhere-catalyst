import React from 'react';
import { LoadingView } from '../feedback/LoadingView';
import { RestrictedAccessView } from '../feedback/RestrictedAccessView';
import { ErrorState } from '../feedback/ErrorState';
import { useGetPlacementProfileQuery } from '@/store/api/placementApi';

interface Props {
  children: React.ReactNode;
}

export function PlacementAccessGate({ children }: Props) {
  const { data: profile, isLoading, isError, error, refetch } = useGetPlacementProfileQuery();

  if (isLoading) return <LoadingView message="Checking access..." />;
  if (isError) {
    const status = 'status' in error ? error.status : undefined;
    if (status === 403 || status === 404) return <RestrictedAccessView />;
    return <ErrorState message="Could not verify placement access." onRetry={refetch} />;
  }
  if (!profile?.isActive) {
    return <RestrictedAccessView />;
  }

  return <>{children}</>;
}
