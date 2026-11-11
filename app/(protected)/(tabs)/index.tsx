import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { TodayPlanCard } from '@/components/study/TodayPlanCard';
import { useGetDashboardQuery, useGetLeaderboardQuery } from '@/store/api/gamificationApi';
import { useGetPlacementProfileQuery } from '@/store/api/placementApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatNumber } from '@/utils/format';

function StreakPill({ days }: { days: number }) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <View
      accessibilityLabel={`${days} day streak`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        height: 32,
        paddingHorizontal: spacing.sm + 4,
        borderRadius: radii.full,
        backgroundColor: colors.streakLight,
      }}
    >
      <Ionicons name="flame" size={16} color={colors.streak} />
      <Text variant="label" color={colors.streak} style={{ letterSpacing: 0 }}>
        {days}
      </Text>
    </View>
  );
}

function pace(done: number, target: number) {
  const percent = (done / Math.max(1, target)) * 100;
  if (percent >= 100) return { label: 'Goal met', variant: 'success' as const };
  if (percent >= 50) return { label: 'On track', variant: 'success' as const };
  return { label: 'Behind', variant: 'destructive' as const };
}

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetDashboardQuery();
  const { data: leaderboard } = useGetLeaderboardQuery('weekly');
  const { data: placementProfile } = useGetPlacementProfileQuery();
  const topThree = leaderboard?.entries.slice(0, 3) ?? [];

  return (
    <Screen scroll padded>
      <ScreenHeader
        title={data ? `Hello, ${data.firstName} 👋` : 'Dashboard'}
        subtitle="Stay disciplined, your dream job is closer every week."
        accessory={data ? <StreakPill days={data.streak} /> : undefined}
      />
      <QueryState
        isLoading={isLoading}
        isError={isError || !data}
        onRetry={refetch}
        loadingMessage="Loading your dashboard…"
        errorMessage="Could not load your dashboard."
      >
        {data ? (
          <View style={{ gap: spacing.md }}>
            <TodayPlanCard />

            <Card tone="hero" style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ flex: 1, gap: spacing.sm }}>
                  <Badge
                    label={pace(data.weeklyApplications.done, data.weeklyApplications.target).label}
                    variant={pace(data.weeklyApplications.done, data.weeklyApplications.target).variant}
                  />
                  <Text variant="h3" color={colors.heroForeground}>
                    Weekly Applications
                  </Text>
                  <Text variant="small" color={colors.heroMuted}>
                    {Math.max(0, data.weeklyApplications.target - data.weeklyApplications.done)} more to
                    hit this week's target.
                  </Text>
                </View>
                <ProgressRing
                  value={(data.weeklyApplications.done / Math.max(1, data.weeklyApplications.target)) * 100}
                  size={92}
                  stroke={9}
                  color={colors.highlight}
                  trackColor={colors.heroForeground + '33'}
                >
                  <Text variant="h3" color={colors.heroForeground}>
                    {data.weeklyApplications.done}/{data.weeklyApplications.target}
                  </Text>
                </ProgressRing>
              </View>
              {placementProfile?.isActive ? (
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Button
                    label="Log New"
                    icon="add"
                    onPress={() => router.push('/(protected)/placement/log-application' as any)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    label="Explore Jobs"
                    variant="onHero"
                    onPress={() => router.navigate('/(protected)/(tabs)/jobs' as any)}
                    style={{ flex: 1 }}
                  />
                </View>
              ) : null}
            </Card>

            <Card tone="tinted" style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="h3">Leaderboard</Text>
                {data.rank ? <Badge label={`Rank #${data.rank}`} variant="info" /> : null}
              </View>
              <View style={{ gap: spacing.sm }}>
                {topThree.map((entry) => (
                  <View
                    key={entry.userId}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      minHeight: 56,
                      paddingHorizontal: spacing.md,
                      borderRadius: radii.lg,
                      backgroundColor: colors.card,
                    }}
                  >
                    <Text variant="label" color={colors.mutedForeground} style={{ width: 16 }}>
                      {entry.rank}
                    </Text>
                    <Avatar name={entry.name} size={34} highlighted={entry.isCurrentUser} />
                    <Text variant="body" numberOfLines={1} style={{ flex: 1 }}>
                      {entry.name}
                    </Text>
                    <Text variant="label" color={colors.mutedForeground}>
                      {formatNumber(entry.points)} pts
                    </Text>
                  </View>
                ))}
              </View>
              <Button
                label="View Full Rankings"
                variant="outline"
                onPress={() => router.push('/(protected)/leaderboard' as any)}
              />
            </Card>

            <Card style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ flex: 1, gap: spacing.sm }}>
                  <Badge
                    label={pace(data.skillHours.done, data.skillHours.target).label}
                    variant={pace(data.skillHours.done, data.skillHours.target).variant}
                  />
                  <Text variant="h3">Skill Building</Text>
                  <Text variant="small" color={colors.mutedForeground}>
                    Target: {data.skillHours.target} hrs / week
                  </Text>
                </View>
                <ProgressRing
                  value={(data.skillHours.done / Math.max(1, data.skillHours.target)) * 100}
                  size={92}
                  stroke={9}
                  color={colors.primary}
                >
                  <Text variant="h3" color={colors.primary}>
                    {data.skillHours.done}h
                  </Text>
                </ProgressRing>
              </View>
              <Button
                label="Explore Labs"
                variant="tonal"
                icon="rocket-outline"
                onPress={() => router.navigate('/(protected)/(tabs)/labs' as any)}
              />
            </Card>

            <Card tone="tinted" style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons name="list" size={22} color={colors.primary} />
                  <Text variant="h3">Career Setup</Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => router.push('/(protected)/tasks' as any)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text variant="label" color={colors.primary}>
                    View Tasks
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ gap: spacing.sm }}>
                {data.careerSetup.map((item) => (
                  <View
                    key={item.label}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      minHeight: 52,
                      paddingHorizontal: spacing.md,
                      borderRadius: radii.lg,
                      backgroundColor: colors.card,
                    }}
                  >
                    <Ionicons
                      name={item.state === 'done' ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={item.state === 'done' ? colors.success : colors.mutedForeground}
                    />
                    <Text
                      variant="body"
                      style={[
                        { flex: 1 },
                        item.state === 'done' ? { color: colors.mutedForeground } : null,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.state === 'now' ? <Badge label="Do now" variant="destructive" /> : null}
                  </View>
                ))}
              </View>
            </Card>

            {data.event ? (
              <Card tone="hero" style={{ gap: spacing.xs }}>
                <Badge label="New event" variant="secondary" />
                <Text variant="h3" color={colors.heroForeground} style={{ marginTop: spacing.sm }}>
                  {data.event.title}
                </Text>
                <Text variant="small" color={colors.heroMuted}>
                  {data.event.description}
                </Text>
              </Card>
            ) : null}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
