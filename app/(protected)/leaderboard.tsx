import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetLeaderboardQuery } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatNumber } from '@/utils/format';
import type { LeaderboardEntry, LeaderboardPeriod } from '@/types/gamification';

const PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'all-time', label: 'Global' },
];

function PodiumPlace({ entry, height, first = false }: { entry?: LeaderboardEntry; height: number; first?: boolean }) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  if (!entry) return <View style={{ flex: 1 }} />;

  return (
    <View
      accessibilityLabel={`Rank ${entry.rank}, ${entry.name}, ${formatNumber(entry.points)} points`}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <View style={{ marginBottom: spacing.sm, alignItems: 'center' }}>
        {first ? <Ionicons name="trophy" size={22} color={colors.highlight} style={{ marginBottom: 2 }} /> : null}
        <Avatar name={entry.name} size={first ? 64 : 52} highlighted={entry.isCurrentUser} />
      </View>
      <View
        style={{
          alignSelf: 'stretch',
          height,
          alignItems: 'center',
          paddingTop: spacing.sm,
          borderTopLeftRadius: radii.lg,
          borderTopRightRadius: radii.lg,
          backgroundColor: first ? colors.hero : colors.surfaceContainer,
        }}
      >
        <Text variant="h3" color={first ? colors.highlight : colors.primary}>
          {entry.rank}
        </Text>
        <Text variant="label" color={first ? colors.heroForeground : colors.foreground} numberOfLines={1}>
          {entry.name.split(' ')[0]}
        </Text>
        <Text variant="label" color={first ? colors.heroMuted : colors.mutedForeground} style={{ letterSpacing: 0 }}>
          {formatNumber(entry.points)}
        </Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const { data, isLoading, isError, refetch } = useGetLeaderboardQuery(period);
  const entries = data?.entries ?? [];
  const rest = entries.slice(3);

  return (
    <Screen scroll padded>
      <ScreenHeader title="Leaderboard" showBack />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
        {PERIODS.map((item) => (
          <Chip
            key={item.value}
            label={item.label}
            selected={period === item.value}
            onPress={() => setPeriod(item.value)}
          />
        ))}
      </View>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        errorMessage="Could not load the leaderboard."
      >
        {entries.length === 0 ? (
          <EmptyState title="No rankings yet" message="Earn points to appear here." />
        ) : (
          <View style={{ gap: spacing.md }}>
            {entries.length >= 3 ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, paddingTop: spacing.md }}>
                <PodiumPlace entry={entries[1]} height={96} />
                <PodiumPlace entry={entries[0]} height={124} first />
                <PodiumPlace entry={entries[2]} height={76} />
              </View>
            ) : null}

            {data?.me ? (
              <Card tone="hero" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View
                  style={{
                    minWidth: 52,
                    height: 52,
                    paddingHorizontal: spacing.sm,
                    borderRadius: radii.lg,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text variant="label" color={colors.primaryForeground} style={{ letterSpacing: 0 }}>
                    RANK
                  </Text>
                  <Text variant="h4" color={colors.primaryForeground}>
                    #{data.me.rank}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="h4" color={colors.heroForeground}>
                    You
                  </Text>
                  {data.me.league ? (
                    <Text variant="small" color={colors.heroMuted}>
                      {data.me.league} league
                    </Text>
                  ) : null}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text variant="h4" color={colors.highlight}>
                    {formatNumber(data.me.points)}
                  </Text>
                  <Text variant="label" color={colors.heroMuted}>
                    {data.me.streak} day streak
                  </Text>
                </View>
              </Card>
            ) : null}

            {rest.length ? (
              <View style={{ gap: spacing.sm }}>
                <Text variant="label" color={colors.mutedForeground}>
                  GLOBAL RANKING
                </Text>
                {rest.map((item) => (
                  <Card
                    key={item.userId}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      paddingVertical: spacing.md,
                      borderColor: item.isCurrentUser ? colors.primary : colors.outlineVariant + '55',
                      borderWidth: item.isCurrentUser ? 2 : 1,
                    }}
                  >
                    <Text variant="h4" color={colors.mutedForeground} style={{ width: 28 }}>
                      {item.rank}
                    </Text>
                    <Avatar name={item.name} size={44} highlighted={item.isCurrentUser} />
                    <View style={{ flex: 1 }}>
                      <Text variant="body" numberOfLines={1}>
                        {item.name}
                      </Text>
                      {item.title ? (
                        <Text variant="label" color={colors.mutedForeground} numberOfLines={1}>
                          {item.title}
                        </Text>
                      ) : null}
                    </View>
                    <Text variant="button" color={colors.primary}>
                      {formatNumber(item.points)}
                    </Text>
                  </Card>
                ))}
              </View>
            ) : null}
          </View>
        )}
      </QueryState>
    </Screen>
  );
}
