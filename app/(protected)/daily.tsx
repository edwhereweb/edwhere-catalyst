import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetDailyQuery, useSubmitDailyMutation } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';

export default function DailyScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetDailyQuery();
  const [submit, { data: result, isLoading: submitting, isError: submitFailed }] = useSubmitDailyMutation();
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = data && !data.done ? data.questions : [];
  const picked = (index: number) => answers[index] ?? -1;
  const allAnswered = questions.length > 0 && questions.every((_, i) => picked(i) >= 0);

  return (
    <Screen scroll padded>
      <ScreenHeader title="Daily 5" subtitle="Three quick questions. Keep your streak alive." showBack />
      <QueryState isLoading={isLoading} isError={isError || !data} onRetry={refetch} errorMessage="Could not load today's questions.">
        {data?.done ? (
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
            <Text variant="h3">Done for today</Text>
            <Text variant="body" color={colors.mutedForeground}>
              You scored {data.score}/{data.total}. Come back tomorrow for new questions.
            </Text>
            <Button label="Back home" onPress={() => router.replace('/(protected)/(tabs)' as any)} />
          </Card>
        ) : data && questions.length === 0 ? (
          <EmptyState title="No questions yet" message="Daily questions appear once study tracks are published." />
        ) : data ? (
          <View style={{ gap: spacing.md }}>
            {result ? (
              <Card tone="hero" style={{ gap: spacing.xs }}>
                <Text variant="h2" color={colors.heroForeground}>
                  {result.score}/{result.total} correct
                </Text>
                <Text variant="body" color={colors.highlight}>
                  +{result.xp} points earned
                </Text>
              </Card>
            ) : null}

            {questions.map((q, qi) => {
              const graded = result?.results[qi];
              return (
                <Card key={qi} style={{ gap: spacing.sm }}>
                  <Text variant="label" color={colors.mutedForeground}>
                    {q.topicTitle}
                    {q.company ? ` · asked at ${q.company}` : ''}
                  </Text>
                  <Text variant="body">{q.question}</Text>
                  {q.options.map((option, oi) => {
                    const chosen = picked(qi) === oi;
                    const correct = graded && graded.correctIndex === oi;
                    const wrong = graded && chosen && !graded.correct;
                    return (
                      <TouchableOpacity
                        key={oi}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: chosen }}
                        disabled={!!result}
                        activeOpacity={0.8}
                        onPress={() => setAnswers((prev) => Object.assign([...prev], { [qi]: oi }))}
                        style={{
                          padding: spacing.md,
                          borderRadius: radii.lg,
                          borderWidth: 1.5,
                          borderColor: correct
                            ? colors.success
                            : wrong
                              ? colors.destructive
                              : chosen
                                ? colors.primary
                                : colors.outlineVariant,
                        }}
                      >
                        <Text variant="small">{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                  {graded?.explanation ? (
                    <Text variant="small" color={colors.mutedForeground}>
                      {graded.explanation}
                    </Text>
                  ) : null}
                </Card>
              );
            })}

            {submitFailed ? (
              <Text variant="small" color={colors.destructive} accessibilityRole="alert">
                Could not submit. You may have already played today.
              </Text>
            ) : null}
            {result ? (
              <Button label="Back home" onPress={() => router.replace('/(protected)/(tabs)' as any)} />
            ) : (
              <Button
                label="Submit answers"
                loading={submitting}
                disabled={!allAnswered}
                onPress={() => submit(questions.map((_, i) => picked(i)))}
              />
            )}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
