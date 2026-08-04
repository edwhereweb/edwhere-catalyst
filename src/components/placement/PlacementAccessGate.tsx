import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { LoadingView } from '../feedback/LoadingView';
import { RestrictedAccessView } from '../feedback/RestrictedAccessView';

interface Props {
  children: React.ReactNode;
}

/**
 * PlacementAccessGate
 *
 * Wraps any placement screen. Reads `hasPlacementAccess` from the Clerk user's
 * `publicMetadata` (set by the admin LMS when granting access). Renders a
 * `RestrictedAccessView` for students who don't have access yet.
 *
 * Clerk `publicMetadata` is trusted server-set data — it cannot be modified by
 * the student client, making this a safe access-control check for UI gating.
 */
export function PlacementAccessGate({ children }: Props) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <LoadingView message="Checking access..." />;
  }

  const hasAccess = (user?.publicMetadata as { hasPlacementAccess?: boolean } | undefined)
    ?.hasPlacementAccess === true;

  if (!hasAccess) {
    return <RestrictedAccessView />;
  }

  return <>{children}</>;
}
