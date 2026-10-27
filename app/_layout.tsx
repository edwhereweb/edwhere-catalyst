import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingView } from '@/components/feedback/LoadingView';
import { setClerkTokenGetter } from '@/services/authToken';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import {
  OpenSans_400Regular,
} from '@expo-google-fonts/open-sans';
import {
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
  async clearToken(key: string) {
    return SecureStore.deleteItemAsync(key);
  },
};

function AuthenticatedApp() {
  const { isLoaded, getToken } = useAuth();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setClerkTokenGetter(() => getToken());
      setTokenReady(true);
    }
  }, [getToken, isLoaded]);

  if (!isLoaded || !tokenReady) {
    return <LoadingView message="Restoring your session…" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    OpenSans_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <ErrorState message="Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment to use Edwhere." />
        </ThemeProvider>
      </Provider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <Provider store={store}>
        <ThemeProvider>
          <AuthenticatedApp />
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
}
