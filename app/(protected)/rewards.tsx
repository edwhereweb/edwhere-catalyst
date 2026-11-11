import React from 'react';
import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressRing } from '@/components/ui/ProgressRing';
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
          <View style={{ gap: spacing.md }}>
            <Card tone="hero" style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: radii.full,
                    backgroundColor: colors.heroForeground + '1f',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="flame" size={34} color={colors.highlight} />
                </View>
                <View>
                  <Text variant="h1" color={colors.heroForeground}>
                    {data.streak}
                  </Text>
                  <Text variant="label" color={colors.heroMuted}>
                    DAY STREAK
                  </Text>
                </View>
              </View>
              <View>
                <Text variant="label" color={colors.heroMuted}>
                  TOTAL POINTS EARNED
                </Text>
                <Text variant="h1" color={colors.highlight}>
                  {formatNumber(data.totalPoints)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {WEEK_DAYS.map((day, index) => {
                  const active = data.activeDays[index];
                  return (
                    <View key={index} style={{ alignItems: 'center', gap: spacing.xs }}>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: radii.full,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: active ? colors.highlight : colors.heroForeground + '26',
                        }}
                      >
                        <Text variant="label" color={active ? colors.onHighlight : colors.heroMuted}>
                          {day}
                        </Text>
                      </View>
                      <Ionicons
                        name={active ? 'checkmark-circle' : 'ellipse'}
                        size={active ? 14 : 6}
                        color={active ? colors.highlight : colors.heroForeground + '40'}
                      />
                    </View>
                  );
                })}
              </View>
            </Card>

            <Card style={{ alignItems: 'center', gap: spacing.md }}>
              <Text variant="label" color={colors.mutedForeground}>
                WEEKLY COMPLETION
              </Text>
              <ProgressRing value={data.weeklyCompletionPercent} size={140} stroke={14}>
                <Text variant="h2" color={colors.primary}>
                  {data.weeklyCompletionPercent}%
                </Text>
                <Text variant="label" color={colors.mutedForeground}>
                  Completed
                </Text>
              </ProgressRing>
            </Card>

            <View style={{ gap: spacing.sm }}>
              <Text variant="h3">Badge Collection</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.xs }}
              >
                {data.badges.map((badge) => (
                  <View
                    key={badge.id}
                    accessibilityLabel={`${badge.name}, ${badge.unlocked ? 'unlocked' : 'locked'}`}
                    style={{ width: 92, alignItems: 'center', gap: spacing.sm, opacity: badge.unlocked ? 1 : 0.5 }}
                  >
                    <View
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: radii.full,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: badge.unlocked ? colors.primaryLight : colors.surfaceContainer,
                      }}
                    >
                      <Ionicons
                        name={badge.unlocked ? 'shield-checkmark' : 'lock-closed'}
                        size={34}
                        color={badge.unlocked ? colors.primary : colors.mutedForeground}
                      />
                    </View>
                    <Text variant="label" style={{ textAlign: 'center' }} numberOfLines={2}>
                      {badge.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={{ gap: spacing.sm }}>
              <Text variant="h3">History of Rewards</Text>
              <Card style={{ gap: spacing.md }}>
                {data.history.length === 0 ? (
                  <Text variant="small" color={colors.mutedForeground}>
                    Complete topics, labs and tasks to start earning points.
                  </Text>
                ) : (
                  data.history.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                      <IconTile icon="trophy-outline" tone="violet" />
                      <View style={{ flex: 1 }}>
                        <Text variant="body" numberOfLines={2}>
                          {item.title}
                        </Text>
                        {item.subtitle ? (
                          <Text variant="small" color={colors.mutedForeground} numberOfLines={1}>
                            {item.subtitle}
                          </Text>
                        ) : null}
                        <Text variant="label" color={colors.mutedForeground}>
                          {formatDateTime(item.occurredAt)}
                        </Text>
                      </View>
                      <Text variant="button" color={colors.success}>
                        +{item.points} pts
                      </Text>
                    </View>
                  ))
                )}
              </Card>
            </View>
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
