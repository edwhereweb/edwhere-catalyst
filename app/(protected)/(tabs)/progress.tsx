import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActionRow } from '@/components/ui/ActionRow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
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
          <View style={{ gap: spacing.md }}>
            <ActionRow
              icon="clipboard-outline"
              tone="primary"
              title="Active Tasks"
              subtitle={`${data.remainingTasks} tasks remaining for this week`}
              actionLabel="View"
              onPress={() => router.push('/(protected)/tasks' as any)}
            />
            {data.draftLab ? (
              <ActionRow
                icon="terminal-outline"
                tone="violet"
                title="In Progress Lab"
                subtitle={`${data.draftLab.title} (Draft)`}
                actionLabel="View"
                onPress={() => router.push(`/(protected)/labs/${data.draftLab?.id}` as any)}
              />
            ) : null}
            {data.activeApplication ? (
              <ActionRow
                icon="briefcase-outline"
                tone="green"
                title="Active Job Apps"
                subtitle={data.activeApplication.title}
                actionLabel="View"
                onPress={() => router.push('/(protected)/placement/applications' as any)}
              />
            ) : null}

            <Card tone="tinted" style={{ gap: spacing.md }}>
              <View>
                <Text variant="h3">Focus Metrics</Text>
                <Text variant="small" color={colors.mutedForeground}>
                  Your performance snapshot
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <IconTile icon="stopwatch-outline" tone="violet" size={52} />
                <View style={{ flex: 1 }}>
                  <Text variant="label" color={colors.mutedForeground}>
                    Time Invested
                  </Text>
                  <Text variant="h2">{data.hoursInvested}h</Text>
                </View>
                <Text variant="label" color={data.hoursChangePercent >= 0 ? colors.success : colors.destructive}>
                  {data.hoursChangePercent >= 0 ? '↑' : '↓'} {Math.abs(data.hoursChangePercent)}%
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <IconTile icon="checkmark-done-outline" tone="primary" size={52} />
                <View style={{ flex: 1 }}>
                  <Text variant="label" color={colors.mutedForeground}>
                    Tasks Completed
                  </Text>
                  <Text variant="h2">
                    {data.tasksCompleted}/{data.tasksTarget}
                  </Text>
                </View>
                <Text variant="label" color={colors.mutedForeground}>
                  Target: {data.tasksTarget}
                </Text>
              </View>
            </Card>

            <Button
              label="Points & Rewards"
              icon="trophy-outline"
              onPress={() => router.push('/(protected)/rewards' as any)}
            />
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
