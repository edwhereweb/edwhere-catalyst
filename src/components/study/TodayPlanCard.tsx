import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
    if (request?.status === 'pending') {
      return (
        <Card style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="h4">Placement Roadmap</Text>
            <Badge label="Awaiting approval" variant="warning" />
          </View>
          <Text variant="small" color={colors.mutedForeground}>
            Your request for {request.track.title} ({request.days} days) is with your instructor.
            You will get a notification once it is approved.
          </Text>
        </Card>
      );
    }

    return (
      <Card style={{ gap: spacing.sm }}>
        <Text variant="h4">Placement Roadmap</Text>
        {request?.status === 'rejected' ? (
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
        <Button
          label={request?.status === 'rejected' ? 'Request Another Track' : 'Request My Plan'}
          onPress={goStart}
        />
      </Card>
    );
  }

  return (
    <Card style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="h4">Today · Day {Math.min(plan.dayNumber, plan.totalDays)}</Text>
        <Text variant="label" color={colors.mutedForeground}>
          {plan.daysLeft} {plan.daysLeft === 1 ? 'day' : 'days'} left
        </Text>
      </View>
      <ProgressBar value={plan.percentComplete} />
      <Text variant="small" color={colors.mutedForeground}>
        {plan.topicsDone}/{plan.topicsTotal} topics · {plan.track.title}
      </Text>

      {plan.today.map((topic) => (
        <TopicRow key={topic.id} topic={topic} onPress={() => openTopic(topic.id)} />
      ))}

      {plan.dayComplete && plan.nextUp ? (
        <Button
          label={`Work ahead: ${plan.nextUp.title}`}
          variant="outline"
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
        variant="ghost"
        onPress={() => router.push('/(protected)/study/roadmap' as any)}
      />
      {request?.status === 'pending' ? (
        <Text variant="label" color={colors.mutedForeground}>
          Request for {request.track.title} is awaiting approval.
        </Text>
      ) : null}
    </Card>
  );
}
