import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
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
  const { colors, spacing, radii } = theme;
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
          <View style={{ gap: spacing.md }}>
            <Card tone="hero" style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Text variant="label" color={colors.heroMuted}>
                    Weekly velocity
                  </Text>
                  <Text variant="h3" color={colors.heroForeground}>
                    On track for {data.projectedPoints} pts
                  </Text>
                </View>
                <ProgressRing
                  value={data.completionPercent}
                  size={84}
                  stroke={9}
                  color={colors.highlight}
                  trackColor={colors.heroForeground + '33'}
                >
                  <Text variant="h4" color={colors.heroForeground}>
                    {data.completionPercent}%
                  </Text>
                </ProgressRing>
              </View>
              <Button
                label={total > 0 && completed === total ? 'Claim Bonus' : `Finish all ${total} tasks to claim`}
                variant="highlight"
                icon="gift-outline"
                loading={isClaiming}
                disabled={total === 0 || completed < total}
                onPress={() => claimBonus()}
              />
              {claimFailed ? (
                <Text variant="label" color={colors.heroMuted}>
                  Could not claim your bonus. Please try again.
                </Text>
              ) : null}
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <Text variant="small" color={colors.mutedForeground}>
                Completed
              </Text>
              <Text variant="h2" color={colors.primary}>
                {completed}
                <Text variant="body" color={colors.mutedForeground}>
                  {' '}
                  / {total} tasks
                </Text>
              </Text>
              <ProgressBar value={total ? (completed / total) * 100 : 0} />
            </Card>

            {data.tasks.map((task) => {
              const done = task.status === 'completed';
              return (
                <Card
                  key={task.id}
                  style={{ gap: spacing.sm, opacity: done ? 0.85 : 1 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={26}
                      color={done ? colors.success : colors.mutedForeground}
                      style={{ marginTop: 1 }}
                    />
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Text
                        variant="h4"
                        style={done ? { textDecorationLine: 'line-through', opacity: 0.6 } : undefined}
                      >
                        {task.title}
                      </Text>
                      <Badge {...statusBadge[task.status]} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.xs,
                        paddingHorizontal: spacing.sm + 2,
                        paddingVertical: spacing.xs,
                        borderRadius: radii.full,
                        backgroundColor: colors.xpLight,
                      }}
                    >
                      <Ionicons name="star" size={13} color={colors.xp} />
                      <Text variant="label" color={colors.xp} style={{ letterSpacing: 0 }}>
                        {done ? '+' : ''}
                        {task.points}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                      <Ionicons name="calendar-outline" size={14} color={colors.mutedForeground} />
                      <Text variant="label" color={colors.mutedForeground}>
                        {task.dueLabel}
                      </Text>
                    </View>
                    {task.category ? <Badge label={task.category} variant="secondary" uppercase={false} /> : null}
                    {task.priority ? <Badge label="Priority" variant="destructive" /> : null}
                  </View>
                  {task.note ? (
                    <Text variant="small" color={colors.mutedForeground}>
                      {task.note}
                    </Text>
                  ) : null}
                </Card>
              );
            })}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
