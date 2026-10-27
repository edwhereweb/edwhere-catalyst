import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingView } from '@/components/feedback/LoadingView';

export default function IndexRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingView />;

  return (
    <Redirect
      href={isSignedIn ? ('/(protected)/(tabs)' as any) : ('/(auth)/sign-in' as any)}
    />
  );
}
