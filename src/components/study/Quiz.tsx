import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useSubmitStudyQuizMutation } from '@/store/api/studyApi';
import { useTheme } from '@/theme/ThemeProvider';
import type { StudyTopic } from '@/types/study';

interface Props {
  topicId: string;
  questions: StudyTopic['questions'];
}

export function Quiz({ topicId, questions }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [submit, { data: result, isLoading, isError, reset }] = useSubmitStudyQuizMutation();

  const answered = answers.every((a) => a >= 0);

  const retry = () => {
    setAnswers(questions.map(() => -1));
    reset();
  };

  return (
    <View style={{ gap: spacing.md }}>
      {result ? (
        <Card style={{ backgroundColor: result.passed ? colors.successLight : colors.warningLight }}>
          <Text variant="h3">
            {result.score}/{result.total} · {result.percent}%
          </Text>
          <Text variant="small">
            {result.passed
              ? 'Passed — topic complete.'
              : `Score ${result.passMark}% or more to complete this topic.`}
          </Text>
        </Card>
      ) : null}

      {questions.map((q, qi) => {
        const graded = result?.results[qi];
        return (
          <Card key={qi} style={{ gap: spacing.sm }}>
            <Text variant="label" color={colors.mutedForeground}>
              Question {qi + 1}
              {q.company ? ` · asked at ${q.company}` : ''}
            </Text>
            <Text variant="body">{q.question}</Text>
            {q.options.map((option, oi) => {
              const chosen = answers[qi] === oi;
              const isCorrect = graded && graded.correctIndex === oi;
              const isWrong = graded && chosen && !graded.correct;
              return (
                <TouchableOpacity
                  key={oi}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: chosen }}
                  disabled={!!result}
                  activeOpacity={0.8}
                  onPress={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                  style={{
                    padding: spacing.sm + 4,
                    borderRadius: radii.lg,
                    borderWidth: 1,
                    borderColor: isCorrect
                      ? colors.success
                      : isWrong
                        ? colors.destructive
                        : chosen
                          ? colors.primary
                          : colors.border,
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

      {isError ? (
        <Text variant="small" color={colors.destructive}>
          Could not submit your answers. Please try again.
        </Text>
      ) : null}
      {result ? (
        <Button label="Retake quiz" variant="outline" onPress={retry} />
      ) : (
        <Button
          label="Submit answers"
          loading={isLoading}
          disabled={!answered}
          onPress={() => submit({ topicId, answers })}
        />
      )}
    </View>
  );
}
