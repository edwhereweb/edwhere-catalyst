import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingView } from '@/components/feedback/LoadingView';
import { UI_PREVIEW } from '@/preview';

export default function IndexRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingView />;

  return (
    <Redirect
      href={isSignedIn || UI_PREVIEW ? ('/(protected)/(tabs)' as any) : ('/(auth)/sign-in' as any)}
    />
  );
}
