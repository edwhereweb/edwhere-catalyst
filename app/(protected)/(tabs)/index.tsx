import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import {
  useGetDashboardQuery,
  useGetLeaderboardQuery,
} from '@/store/api/gamificationApi';
import { useGetPlacementProfileQuery } from '@/store/api/placementApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatNumber } from '@/utils/format';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
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
      />
      <QueryState
        isLoading={isLoading}
        isError={isError || !data}
        onRetry={refetch}
        loadingMessage="Loading your dashboard…"
        errorMessage="Could not load your dashboard."
      >
        {data ? (
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="h4">Weekly Applications</Text>
                <Badge label={`🔥 ${data.streak}`} variant="warning" />
              </View>
              <Text variant="h2" color={colors.primary}>
                {data.weeklyApplications.done}/{data.weeklyApplications.target}
              </Text>
              <ProgressBar
                value={(data.weeklyApplications.done / Math.max(1, data.weeklyApplications.target)) * 100}
              />
              {placementProfile?.isActive ? (
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                  <Button
                    label="Log New"
                    onPress={() => router.push('/(protected)/placement/log-application' as any)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    label="Explore Jobs"
                    variant="outline"
                    onPress={() => router.push('/(protected)/placement' as any)}
                    style={{ flex: 1 }}
                  />
                </View>
              ) : null}
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="h4">Leaderboard</Text>
                {data.rank ? <Badge label={`Rank #${data.rank}`} variant="info" /> : null}
              </View>
              {topThree.map((entry) => (
                <View
                  key={entry.userId}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                >
                  <Text variant="label" style={{ width: spacing.lg }}>
                    {entry.rank}
                  </Text>
                  <Avatar name={entry.name} size={32} highlighted={entry.isCurrentUser} />
                  <Text variant="body" style={{ flex: 1 }}>
                    {entry.name}
                  </Text>
                  <Text variant="label" color={colors.mutedForeground}>
                    {formatNumber(entry.points)} pts
                  </Text>
                </View>
              ))}
              <Button
                label="View Full Rankings"
                variant="ghost"
                onPress={() => router.push('/(protected)/leaderboard' as any)}
              />
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <Text variant="h4">Skill Building</Text>
              <Text variant="small" color={colors.mutedForeground}>
                Target: {data.skillHours.target} hrs / week
              </Text>
              <Text variant="h2" color={colors.secondary}>
                {data.skillHours.done}h
              </Text>
              <ProgressBar
                color={colors.secondary}
                value={(data.skillHours.done / Math.max(1, data.skillHours.target)) * 100}
              />
              <Button
                label="Explore Labs"
                variant="secondary"
                onPress={() => router.push('/(protected)/(tabs)/labs' as any)}
              />
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="h4">Career Setup</Text>
                <TouchableOpacity onPress={() => router.push('/(protected)/tasks' as any)}>
                  <Text variant="label" color={colors.primary}>
                    View Tasks
                  </Text>
                </TouchableOpacity>
              </View>
              {data.careerSetup.map((item) => (
                <View
                  key={item.label}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                >
                  <Ionicons
                    name={item.state === 'done' ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={item.state === 'done' ? colors.success : colors.mutedForeground}
                  />
                  <Text variant="body" style={{ flex: 1 }}>
                    {item.label}
                  </Text>
                  {item.state === 'now' ? <Badge label="Do now" variant="destructive" /> : null}
                </View>
              ))}
            </Card>

            {data.event ? (
              <Card style={{ gap: spacing.xs, backgroundColor: colors.inverseSurface }}>
                <Text variant="label" color={colors.inverseOnSurface}>
                  New Event
                </Text>
                <Text variant="h4" color={colors.inverseOnSurface}>
                  {data.event.title}
                </Text>
                <Text variant="small" color={colors.inverseOnSurface}>
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
