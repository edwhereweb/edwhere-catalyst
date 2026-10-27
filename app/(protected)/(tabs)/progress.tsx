import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetInProgressQuery } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRelativeTime } from '@/utils/format';

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetInProgressQuery();

  return (
    <Screen scroll padded>
      <ScreenHeader
        title="In Progress"
        subtitle={data ? `Last updated ${formatRelativeTime(data.lastUpdated)}` : undefined}
      />
      <QueryState
        isLoading={isLoading}
        isError={isError || !data}
        onRetry={refetch}
        errorMessage="Could not load your progress."
      >
        {data ? (
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            <Card style={{ gap: spacing.xs }}>
              <Text variant="h4">Active Tasks</Text>
              <Text variant="small" color={colors.mutedForeground}>
                {data.remainingTasks} tasks remaining for this week
              </Text>
              <Button
                label="View"
                variant="outline"
                onPress={() => router.push('/(protected)/tasks' as any)}
              />
            </Card>
            {data.draftLab ? (
              <Card style={{ gap: spacing.xs }}>
                <Text variant="h4">In Progress Lab</Text>
                <Text variant="small" color={colors.mutedForeground}>
                  {data.draftLab.title}
                </Text>
                <Button
                  label="View"
                  variant="outline"
                  onPress={() => router.push(`/(protected)/labs/${data.draftLab?.id}` as any)}
                />
              </Card>
            ) : null}
            {data.activeApplication ? (
              <Card style={{ gap: spacing.xs }}>
                <Text variant="h4">Active Job Apps</Text>
                <Text variant="small" color={colors.mutedForeground}>
                  {data.activeApplication.title}
                </Text>
                <Button
                  label="View"
                  variant="outline"
                  onPress={() => router.push('/(protected)/placement/applications' as any)}
                />
              </Card>
            ) : null}
            <Text variant="h4">Focus Metrics</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Card style={{ flex: 1 }}>
                <Text variant="label" color={colors.mutedForeground}>
                  Time Invested
                </Text>
                <Text variant="h3">{data.hoursInvested}h</Text>
                <Text variant="label" color={colors.success}>
                  ↑ {data.hoursChangePercent}%
                </Text>
              </Card>
              <Card style={{ flex: 1 }}>
                <Text variant="label" color={colors.mutedForeground}>
                  Tasks Completed
                </Text>
                <Text variant="h3">
                  {data.tasksCompleted}/{data.tasksTarget}
                </Text>
              </Card>
            </View>
            <Button
              label="Points & Rewards"
              onPress={() => router.push('/(protected)/rewards' as any)}
              fullWidth
            />
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
