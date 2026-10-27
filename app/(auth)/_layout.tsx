import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingView } from '@/components/feedback/LoadingView';

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingView />;
  if (isSignedIn) return <Redirect href={'/(protected)/(tabs)' as any} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
