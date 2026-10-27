import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingView } from '@/components/feedback/LoadingView';
import { RestrictedAccessView } from '@/components/feedback/RestrictedAccessView';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useGetPlacementProfileQuery } from '@/store/api/placementApi';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    data: placementProfile,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPlacementProfileQuery();
  const errorStatus = isError && 'status' in error ? error.status : undefined;

  return (
    <Screen padded>
      <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing.md }}>
        <Text variant="h1">Edwhere</Text>
        <Text variant="body" color={theme.colors.mutedForeground}>
          Your learning and career opportunities, in one place.
        </Text>
        {isLoading ? (
          <LoadingView message="Checking your placement access…" />
        ) : placementProfile?.isActive ? (
          <Button
            label="Explore jobs"
            onPress={() => router.push('/(protected)/placement' as any)}
            fullWidth
          />
        ) : isError && errorStatus !== 403 && errorStatus !== 404 ? (
          <ErrorState message="Could not load your placement profile." onRetry={refetch} />
        ) : (
          <RestrictedAccessView />
        )}
      </View>
    </Screen>
  );
}
