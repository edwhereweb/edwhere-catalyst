import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingView } from '@/components/feedback/LoadingView';

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingView />;
  if (isSignedIn) return <Redirect href="/(protected)/(tabs)" />;

  return null; // expo-router renders the child (auth) screens
}
