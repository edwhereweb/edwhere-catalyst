import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { useGetMockTestsQuery } from '@/store/api/mockTestApi';
import { useTheme } from '@/theme/ThemeProvider';

export default function MockTestsScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetMockTestsQuery();

  return (
    <Screen scroll padded>
      <ScreenHeader title="Mock Tests" subtitle="Practise a company's real test pattern" showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        errorMessage="Could not load mock tests."
      >
        {data?.length ? (
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            {data.map((test) => (
              <Card key={test.id} style={{ gap: spacing.sm }}>
                <Text variant="h4">{test.title}</Text>
                <Text variant="small" color={colors.mutedForeground}>
                  {test.description}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <Badge label={`${test.mcqCount} MCQs`} uppercase={false} />
                  <Badge label={`${test.codingCount} coding`} uppercase={false} />
                  <Badge label={`~${test.totalMinutes} min`} uppercase={false} />
                  {test.bestPercent != null ? (
                    <Badge label={`Best ${test.bestPercent}%`} variant="success" uppercase={false} />
                  ) : null}
                </View>
                <Button
                  label={test.attempts ? 'Try Again' : 'View & Start'}
                  onPress={() => router.push(`/(protected)/mock-tests/${test.id}` as any)}
                />
              </Card>
            ))}
          </View>
        ) : (
          <EmptyState title="No mock tests yet" message="Your instructors will add company tests here." />
        )}
      </QueryState>
    </Screen>
  );
}
