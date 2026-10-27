import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { useClaimWeeklyBonusMutation, useGetWeeklyTasksQuery } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import type { TaskStatus } from '@/types/gamification';

const statusBadge = {
  completed: { label: 'Completed', variant: 'success' },
  in_progress: { label: 'In Progress', variant: 'info' },
  pending: { label: 'Pending', variant: 'default' },
} as const satisfies Record<TaskStatus, { label: string; variant: 'success' | 'info' | 'default' }>;

export default function WeeklyTasksScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { data, isLoading, isError, refetch } = useGetWeeklyTasksQuery();
  const [claimBonus, { isLoading: isClaiming, isError: claimFailed }] = useClaimWeeklyBonusMutation();

  const completed = data?.tasks.filter((task) => task.status === 'completed').length ?? 0;
  const total = data?.tasks.length ?? 0;

  return (
    <Screen scroll padded>
      <ScreenHeader title="This Week's Tasks" subtitle={data?.weekLabel} showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError || !data}
        onRetry={refetch}
        errorMessage="Could not load this week's tasks."
      >
        {data ? (
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            <Card style={{ gap: spacing.sm }}>
              <Text variant="h4">Weekly Velocity</Text>
              <Text variant="small" color={colors.mutedForeground}>
                On Track for {data.projectedPoints} pts
              </Text>
              <ProgressBar value={data.completionPercent} />
              <Text variant="label" color={colors.mutedForeground}>
                {data.completionPercent}% Completed • {completed} / {total} Tasks
              </Text>
              <Button
                label="Claim Bonus"
                loading={isClaiming}
                disabled={total === 0 || completed < total}
                onPress={() => claimBonus()}
              />
              {claimFailed ? (
                <Text variant="label" color={colors.destructive}>
                  Could not claim your bonus. Please try again.
                </Text>
              ) : null}
            </Card>
            {data.tasks.map((task) => (
              <Card key={task.id} style={{ gap: spacing.xs }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
                  <Text variant="h4" style={{ flex: 1 }}>
                    {task.title}
                  </Text>
                  <Badge {...statusBadge[task.status]} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Text variant="label" color={colors.mutedForeground}>
                    {task.dueLabel}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                    <Ionicons name="star" size={14} color={colors.xp} />
                    <Text variant="label" color={colors.xp}>
                      {task.status === 'completed' ? '+' : ''}
                      {task.points} pts
                    </Text>
                  </View>
                  {task.category ? <Badge label={task.category} variant="secondary" /> : null}
                  {task.priority ? <Badge label="Priority" variant="destructive" /> : null}
                </View>
                {task.note ? (
                  <Text variant="small" color={colors.mutedForeground}>
                    {task.note}
                  </Text>
                ) : null}
              </Card>
            ))}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
