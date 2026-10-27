import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingView } from '@/components/feedback/LoadingView';

export default function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingView />;
  if (!isSignedIn) return <Redirect href={'/(auth)/sign-in' as any} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
