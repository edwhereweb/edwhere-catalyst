import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import { TopicRow } from '@/components/study/TopicRow';
import { useGetStudyRoadmapQuery } from '@/store/api/studyApi';
import { useTheme } from '@/theme/ThemeProvider';

export default function RoadmapScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetStudyRoadmapQuery();

  return (
    <Screen scroll padded>
      <ScreenHeader title="Roadmap" subtitle={data?.track.title} showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        errorMessage="Could not load your roadmap."
      >
        {!data ? (
          <EmptyState
            title="No plan yet"
            message="Request a plan and, once approved, your roadmap appears here."
            actionLabel="Request My Plan"
            onAction={() => router.push('/(protected)/study/start' as any)}
          />
        ) : (
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            {data.modules.map((module, index) => {
              const done = module.topics.filter((t) => t.done).length;
              return (
                <Card key={module.id} style={{ gap: spacing.md }}>
                  <View>
                    <Text variant="h4">
                      {index + 1}. {module.title}
                    </Text>
                    <Text variant="label" color={colors.mutedForeground}>
                      {done}/{module.topics.length} topics done
                    </Text>
                  </View>
                  {module.topics.map((topic) => (
                    <View key={topic.id} style={{ gap: spacing.xs }}>
                      <TopicRow
                        topic={topic}
                        onPress={() => router.push(`/(protected)/study/topic/${topic.id}` as any)}
                      />
                      {topic.subtopics.length ? (
                        <Text
                          variant="small"
                          color={colors.mutedForeground}
                          style={{ marginLeft: spacing.xl }}
                        >
                          {topic.subtopics.join(' · ')}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </Card>
              );
            })}
          </View>
        )}
      </QueryState>
    </Screen>
  );
}
