import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { TopicRow } from './TopicRow';
import { useGetStudyPlanQuery } from '@/store/api/studyApi';
import { useTheme } from '@/theme/ThemeProvider';

export function TodayPlanCard() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data, isLoading, isError } = useGetStudyPlanQuery();

  // The plan is an add-on to the dashboard, so loading and errors stay out of the way.
  if (isLoading || isError || !data) return null;
  const { plan, request } = data;

  const openTopic = (id: string) => router.push(`/(protected)/study/topic/${id}` as any);
  const goStart = () => router.push('/(protected)/study/start' as any);

  if (!plan) {
    const pending = request?.status === 'pending';
    const rejected = request?.status === 'rejected';

    return (
      <Card style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <IconTile icon="map-outline" tone="primary" />
          <View style={{ flex: 1 }}>
            <Text variant="h4">Placement Roadmap</Text>
            {pending ? <Badge label="Awaiting approval" variant="warning" style={{ marginTop: 4 }} /> : null}
          </View>
        </View>
        {pending ? (
          <Text variant="small" color={colors.mutedForeground}>
            Your request for {request.track.title} ({request.days} days) is with your instructor. You
            will get a notification once it is approved.
          </Text>
        ) : rejected ? (
          <Text variant="small" color={colors.destructive}>
            Your request for {request.track.title} was not approved
            {request.note ? `: ${request.note}` : '.'}
          </Text>
        ) : (
          <Text variant="small" color={colors.mutedForeground}>
            Pick a track and how many days you have. Once your instructor approves, you get a
            day-by-day plan to crack your interviews.
          </Text>
        )}
        {!pending ? (
          <Button label={rejected ? 'Request Another Track' : 'Request My Plan'} onPress={goStart} />
        ) : null}
      </Card>
    );
  }

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconTile icon="today-outline" tone="primary" />
        <View style={{ flex: 1 }}>
          <Text variant="h4" numberOfLines={1}>
            Today · Day {Math.min(plan.dayNumber, plan.totalDays)}
          </Text>
          <Text variant="label" color={colors.mutedForeground} numberOfLines={1}>
            {plan.track.title}
          </Text>
        </View>
      </View>

      <View style={{ gap: spacing.xs }}>
        <ProgressBar value={plan.percentComplete} />
        <Text variant="label" color={colors.mutedForeground}>
          {plan.topicsDone} of {plan.topicsTotal} topics complete · {plan.daysLeft}{' '}
          {plan.daysLeft === 1 ? 'day' : 'days'} left
        </Text>
      </View>

      <View style={{ gap: spacing.sm }}>
        {plan.today.map((topic) => (
          <TopicRow key={topic.id} topic={topic} onPress={() => openTopic(topic.id)} />
        ))}
      </View>

      {plan.dayComplete && plan.nextUp ? (
        <Button
          label={`Work ahead: ${plan.nextUp.title}`}
          variant="tonal"
          icon="flash-outline"
          onPress={() => openTopic(plan.nextUp!.id)}
        />
      ) : null}
      {plan.dayComplete && !plan.nextUp ? (
        <Text variant="small" color={colors.success}>
          You have finished the whole roadmap. 🎉
        </Text>
      ) : null}
      <Button
        label="View Roadmap"
        variant="outline"
        icon="map-outline"
        onPress={() => router.push('/(protected)/study/roadmap' as any)}
      />
      {request?.status === 'pending' ? (
        <Text variant="label" color={colors.mutedForeground}>
          Your request for {request.track.title} is awaiting approval.
        </Text>
      ) : null}
    </Card>
  );
}
