import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetRewardsQuery } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatDateTime, formatNumber } from '@/utils/format';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function RewardsScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { data, isLoading, isError, refetch } = useGetRewardsQuery();

  return (
    <Screen scroll padded>
      <ScreenHeader title="Your Progress" showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError || !data}
        onRetry={refetch}
        errorMessage="Could not load your rewards."
      >
        {data ? (
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <Ionicons name="flame" size={28} color={colors.streak} />
                <Text variant="h3">{data.streak}</Text>
                <Text variant="label" color={colors.mutedForeground}>
                  Day Streak
                </Text>
              </Card>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <Ionicons name="star" size={28} color={colors.xp} />
                <Text variant="h3">{formatNumber(data.totalPoints)}</Text>
                <Text variant="label" color={colors.mutedForeground}>
                  Total Points
                </Text>
              </Card>
            </View>

            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {WEEK_DAYS.map((day, index) => (
                  <View key={index} style={{ alignItems: 'center', gap: spacing.xs }}>
                    <Text variant="label" color={colors.mutedForeground}>
                      {day}
                    </Text>
                    <Ionicons
                      name={data.activeDays[index] ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={data.activeDays[index] ? colors.success : colors.outlineVariant}
                    />
                  </View>
                ))}
              </View>
              <Text variant="h4">Weekly Completion: {data.weeklyCompletionPercent}%</Text>
              <ProgressBar value={data.weeklyCompletionPercent} color={colors.success} />
            </Card>

            <Text variant="h4">Badge Collection</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {data.badges.map((badge) => (
                <Card
                  key={badge.id}
                  style={{
                    width: '31%',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: spacing.sm,
                    opacity: badge.unlocked ? 1 : 0.5,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: radii.full,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.badgeLight,
                    }}
                  >
                    <Ionicons
                      name={badge.unlocked ? 'ribbon' : 'lock-closed'}
                      size={24}
                      color={colors.badge}
                    />
                  </View>
                  <Text variant="label" style={{ textAlign: 'center' }}>
                    {badge.name}
                  </Text>
                </Card>
              ))}
            </View>

            <Text variant="h4">History of Rewards</Text>
            {data.history.map((item) => (
              <Card key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body">{item.title}</Text>
                  <Text variant="small" color={colors.mutedForeground}>
                    {item.subtitle}
                  </Text>
                  <Text variant="label" color={colors.mutedForeground}>
                    {formatDateTime(item.occurredAt)}
                  </Text>
                </View>
                <Text variant="button" color={colors.success}>
                  +{item.points} pts
                </Text>
              </Card>
            ))}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
