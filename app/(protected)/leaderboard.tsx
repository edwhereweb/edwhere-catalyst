import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
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

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const { data, isLoading, isError, refetch } = useGetLeaderboardQuery(period);

  return (
    <Screen padded>
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
      {data?.me ? (
        <Card
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            marginBottom: spacing.md,
            backgroundColor: colors.primary,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text variant="h4" color={colors.primaryForeground}>
              You (Rank #{data.me.rank})
            </Text>
            {data.me.league ? (
              <Text variant="small" color={colors.primaryForeground}>
                In {data.me.league}
              </Text>
            ) : null}
          </View>
          <Text variant="label" color={colors.primaryForeground}>
            ⚡ {formatNumber(data.me.points)}
          </Text>
          <Text variant="label" color={colors.primaryForeground}>
            🔥 {data.me.streak} Days
          </Text>
        </Card>
      ) : null}
      <View style={{ flex: 1 }}>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          errorMessage="Could not load the leaderboard."
        >
          <FlatList<LeaderboardEntry>
            data={data?.entries}
            keyExtractor={(entry) => entry.userId}
            contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl, flexGrow: 1 }}
            ListEmptyComponent={<EmptyState title="No rankings yet" />}
            renderItem={({ item }) => (
              <Card
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  borderColor: item.isCurrentUser ? colors.primary : colors.border + '40',
                }}
              >
                <Text variant="h4" style={{ width: spacing.xl }}>
                  {item.rank}
                </Text>
                <Avatar name={item.name} highlighted={item.isCurrentUser} />
                <View style={{ flex: 1 }}>
                  <Text variant="body">{item.name}</Text>
                  {item.title ? (
                    <Text variant="label" color={colors.mutedForeground}>
                      {item.title}
                    </Text>
                  ) : null}
                </View>
                <Text variant="label" color={colors.xp}>
                  {formatNumber(item.points)} pts
                </Text>
              </Card>
            )}
          />
        </QueryState>
      </View>
    </Screen>
  );
}
