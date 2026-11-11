import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { Flashcards } from '@/components/study/Flashcards';
import { Quiz } from '@/components/study/Quiz';
import { useCompleteStudyTopicMutation, useGetStudyTopicQuery } from '@/store/api/studyApi';
import { useTheme } from '@/theme/ThemeProvider';

type Section = 'learn' | 'cards' | 'quiz';

export default function TopicScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { data: topic, isLoading, isError, refetch } = useGetStudyTopicQuery(topicId);
  const [complete, { isLoading: completing, isError: completeFailed }] =
    useCompleteStudyTopicMutation();
  const [section, setSection] = useState<Section>('learn');

  return (
    <Screen scroll padded>
      <ScreenHeader title={topic?.title ?? 'Topic'} subtitle={topic?.moduleTitle} showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError || !topic}
        onRetry={refetch}
        errorMessage="Could not load this topic."
      >
        {topic ? (
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <Chip label="Learn" selected={section === 'learn'} onPress={() => setSection('learn')} />
              {topic.cards.length ? (
                <Chip
                  label={`Flashcards (${topic.cards.length})`}
                  selected={section === 'cards'}
                  onPress={() => setSection('cards')}
                />
              ) : null}
              {topic.questions.length ? (
                <Chip
                  label={`Quiz (${topic.questions.length})`}
                  selected={section === 'quiz'}
                  onPress={() => setSection('quiz')}
                />
              ) : null}
            </View>

            {topic.done ? (
              <Badge
                label={topic.bestScore != null ? `Completed · best ${topic.bestScore}%` : 'Completed'}
                variant="success"
              />
            ) : null}

            {section === 'learn' ? (
              <Card style={{ gap: spacing.sm }}>
                <Text variant="label" color={colors.mutedForeground}>
                  About {topic.estMinutes} min · cover these sub-topics
                </Text>
                {topic.subtopics.length ? (
                  topic.subtopics.map((s) => (
                    <Text key={s} variant="body">
                      • {s}
                    </Text>
                  ))
                ) : (
                  <Text variant="small" color={colors.mutedForeground}>
                    No sub-topics listed.
                  </Text>
                )}
              </Card>
            ) : null}
            {section === 'learn' && (topic.cards.length > 0 || topic.questions.length > 0) ? (
              <View style={{ gap: spacing.sm }}>
                {topic.cards.length > 0 ? (
                  <Button
                    label="Practice flashcards"
                    variant={topic.questions.length > 0 ? 'tonal' : 'primary'}
                    icon="albums-outline"
                    onPress={() => setSection('cards')}
                  />
                ) : null}
                {topic.questions.length > 0 ? (
                  <Button label="Take the quiz" icon="help-circle-outline" onPress={() => setSection('quiz')} />
                ) : null}
              </View>
            ) : null}
            {section === 'cards' ? <Flashcards cards={topic.cards} /> : null}
            {section === 'quiz' ? <Quiz topicId={topic.id} questions={topic.questions} /> : null}

            {/* Topics without a quiz are completed by hand; quizzes complete the topic on pass. */}
            {!topic.done && topic.questions.length === 0 ? (
              <>
                {completeFailed ? (
                  <Text variant="small" color={colors.destructive}>
                    Could not mark this topic complete. Please try again.
                  </Text>
                ) : null}
                <Button
                  label="Mark as complete"
                  loading={completing}
                  onPress={() => complete(topic.id)}
                />
              </>
            ) : null}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
