import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { QueryState } from '@/components/feedback/QueryState';
import { OptionButton } from '@/components/study/OptionButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { useGetMockTestQuery, useSubmitMockAttemptMutation } from '@/store/api/mockTestApi';
import { useTheme } from '@/theme/ThemeProvider';
import type {
  CodingStatus,
  MockAttemptInput,
  MockAttemptResult,
  MockSection,
  MockTest,
} from '@/types/mockTest';

type Phase = { kind: 'intro' } | { kind: 'section'; index: number } | { kind: 'coding' } | { kind: 'report' };

const CODING_LABEL: Record<CodingStatus, string> = {
  none: 'Not attempted',
  partial: 'Partly done',
  solved: 'Solved',
};

/** Counts down from totalSec; restarts when runKey changes. Uses wall-clock time so it survives backgrounding. */
function useCountdown(totalSec: number, runKey: string, onExpire: () => void) {
  const [left, setLeft] = useState(totalSec);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  useEffect(() => {
    const end = Date.now() + totalSec * 1000;
    setLeft(totalSec);
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        clearInterval(id);
        expire.current();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [runKey, totalSec]);

  return left;
}

const clock = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function TimerPill({ seconds }: { seconds: number }) {
  const { colors, radii, spacing } = useTheme().theme;
  const low = seconds <= 60;
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radii.full,
        backgroundColor: low ? colors.destructive + '20' : colors.muted,
      }}
    >
      <Text variant="button" color={low ? colors.destructive : colors.foreground}>
        {clock(seconds)}
      </Text>
    </View>
  );
}

function Intro({ test, onStart }: { test: MockTest; onStart: () => void }) {
  const { colors, spacing } = useTheme().theme;
  return (
    <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
      <Card style={{ gap: spacing.sm }}>
        <Text variant="h4">How this test works</Text>
        {test.sections.map((s, i) => (
          <Text key={s.key} variant="small">
            {i + 1}. {s.title}: {s.questions.length} questions, {s.minutes} min
          </Text>
        ))}
        {test.coding.problems.length ? (
          <Text variant="small">
            {test.sections.length + 1}. Coding round: {test.coding.problems.length} problems,{' '}
            {test.coding.minutes} min. Solve on your own system and report how it went.
          </Text>
        ) : null}
        <Text variant="small" color={colors.mutedForeground}>
          Each section is timed and submits automatically when time is up. 1 mark per correct answer, no
          negative marking. You cannot go back to a submitted section.
        </Text>
      </Card>
      {test.pattern.length ? (
        <Card tone="tinted" style={{ gap: spacing.xs }}>
          <Text variant="h4">The real process</Text>
          {test.pattern.map((p) => (
            <Text key={p} variant="small">
              • {p}
            </Text>
          ))}
          <Text variant="label" color={colors.mutedForeground} style={{ marginTop: spacing.xs }}>
            Based on candidate-reported experiences, not an official paper. Patterns change.
          </Text>
        </Card>
      ) : null}
      <Button label="Start Test" onPress={onStart} />
    </View>
  );
}

function SectionRunner({
  section,
  position,
  total,
  answers,
  onAnswer,
  onSubmit,
}: {
  section: MockSection;
  position: number;
  total: number;
  answers: number[];
  onAnswer: (qi: number, oi: number) => void;
  onSubmit: (seconds: number) => void;
}) {
  const { colors, spacing, radii } = useTheme().theme;
  const [qi, setQi] = useState(0);
  const [flags, setFlags] = useState<boolean[]>(() => section.questions.map(() => false));
  const startedAt = useRef(Date.now());
  const submit = () => onSubmit(Math.round((Date.now() - startedAt.current) / 1000));
  const left = useCountdown(section.minutes * 60, section.key, submit);
  const q = section.questions[qi];
  const unanswered = answers.filter((a) => a < 0).length;

  const confirmSubmit = () =>
    Alert.alert(
      'Submit section?',
      unanswered ? `${unanswered} question(s) are unanswered.` : 'All questions answered.',
      [{ text: 'Keep going', style: 'cancel' }, { text: 'Submit', onPress: submit }],
    );

  return (
    <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge label={`Section ${position}/${total}`} uppercase={false} />
        <TimerPill seconds={left} />
      </View>
      <Text variant="h3">{section.title}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {section.questions.map((_, i) => {
          const done = answers[i] >= 0;
          const current = i === qi;
          return (
            <TouchableOpacity
              key={i}
              accessibilityLabel={`Question ${i + 1}${flags[i] ? ', flagged' : ''}${done ? ', answered' : ''}`}
              onPress={() => setQi(i)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: current ? colors.primary : flags[i] ? colors.warning : colors.outlineVariant,
                backgroundColor: done ? colors.primaryLight : colors.card,
              }}
            >
              <Text variant="label">{i + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Card style={{ gap: spacing.sm }}>
        <Text variant="label" color={colors.mutedForeground}>
          Question {qi + 1} of {section.questions.length}
        </Text>
        <Text variant="body">{q.question}</Text>
        {q.code ? (
          <View style={{ backgroundColor: colors.muted, borderRadius: radii.lg, padding: spacing.md }}>
            <Text variant="small" style={{ fontFamily: 'monospace' }}>
              {q.code}
            </Text>
          </View>
        ) : null}
        {q.options.map((option, oi) => (
          <OptionButton
            key={oi}
            letter={String.fromCharCode(65 + oi)}
            label={option}
            chosen={answers[qi] === oi}
            onPress={() => onAnswer(qi, answers[qi] === oi ? -1 : oi)}
          />
        ))}
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Button
          label="Previous"
          variant="outline"
          style={{ flex: 1 }}
          disabled={qi === 0}
          onPress={() => setQi(qi - 1)}
        />
        <Button
          label={flags[qi] ? 'Unflag' : 'Flag'}
          variant="outline"
          style={{ flex: 1 }}
          onPress={() => setFlags((f) => f.map((v, i) => (i === qi ? !v : v)))}
        />
        <Button
          label="Next"
          variant="outline"
          style={{ flex: 1 }}
          disabled={qi === section.questions.length - 1}
          onPress={() => setQi(qi + 1)}
        />
      </View>
      <Button label="Submit Section" onPress={confirmSubmit} />
    </View>
  );
}

function CodingRound({
  test,
  status,
  onStatus,
  onFinish,
}: {
  test: MockTest;
  status: Record<string, CodingStatus>;
  onStatus: (key: string, s: CodingStatus) => void;
  onFinish: (seconds: number) => void;
}) {
  const { colors, spacing, radii } = useTheme().theme;
  const startedAt = useRef(Date.now());
  const finish = () => onFinish(Math.round((Date.now() - startedAt.current) / 1000));
  const left = useCountdown(test.coding.minutes * 60, 'coding', finish);

  return (
    <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge label="Coding round" uppercase={false} />
        <TimerPill seconds={left} />
      </View>
      <Text variant="small" color={colors.mutedForeground}>
        Solve these on your own laptop or editor in any language. Nothing is graded here. When you are done,
        mark how each one went.
      </Text>
      {test.coding.problems.map((p, i) => (
        <Card key={p.key} style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="h4" style={{ flex: 1 }}>
              {i + 1}. {p.title}
            </Text>
            <Badge label={p.difficulty} uppercase={false} variant="info" />
          </View>
          <Text variant="body">{p.statement}</Text>
          {p.examples.map((ex, ei) => (
            <View key={ei} style={{ backgroundColor: colors.muted, borderRadius: radii.lg, padding: spacing.md }}>
              <Text variant="small" style={{ fontFamily: 'monospace' }}>
                Input: {ex.input}
                {'\n'}Output: {ex.output}
              </Text>
            </View>
          ))}
          {p.constraints.map((c) => (
            <Text key={c} variant="label" color={colors.mutedForeground}>
              • {c}
            </Text>
          ))}
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
            {(['none', 'partial', 'solved'] as CodingStatus[]).map((s) => (
              <Button
                key={s}
                size="sm"
                label={CODING_LABEL[s]}
                variant={(status[p.key] ?? 'none') === s ? 'primary' : 'outline'}
                style={{ flex: 1 }}
                onPress={() => onStatus(p.key, s)}
              />
            ))}
          </View>
        </Card>
      ))}
      <Button label="Finish Test" onPress={finish} />
    </View>
  );
}

function Report({
  test,
  answers,
  status,
  result,
  isLoading,
  isError,
  onRetry,
  onExit,
}: {
  test: MockTest;
  answers: Record<string, number[]>;
  status: Record<string, CodingStatus>;
  result?: MockAttemptResult;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onExit: () => void;
}) {
  const { colors, spacing } = useTheme().theme;
  const [review, setReview] = useState(false);

  if (!result) {
    return (
      <View style={{ gap: spacing.md, paddingVertical: spacing.xl }}>
        <Text variant="body" color={isError ? colors.destructive : colors.mutedForeground}>
          {isError
            ? 'Could not submit your attempt. Your answers are kept, so try again.'
            : 'Submitting your attempt…'}
        </Text>
        {isError ? <Button label="Try again" loading={isLoading} onPress={onRetry} /> : null}
      </View>
    );
  }

  const { score, total } = result;
  const topics: Record<string, { right: number; all: number }> = {};
  test.sections.forEach((s) => {
    const key = result.sections.find((r) => r.key === s.key);
    s.questions.forEach((q, i) => {
      const t = (topics[q.topic] ??= { right: 0, all: 0 });
      t.all += 1;
      if (answers[s.key][i] === key?.review[i]?.correctIndex) t.right += 1;
    });
  });
  const weak = Object.entries(topics)
    .filter(([, v]) => v.right / v.all < 0.6)
    .map(([k]) => k);

  return (
    <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
      <Card tone="hero" style={{ gap: spacing.xs }}>
        <Text variant="h1" color="#ffffff">
          {score}/{total}
        </Text>
        <Text variant="small" color="#ffffff">
          {Math.round((score / Math.max(total, 1)) * 100)}% on the MCQ sections · {Math.round(result.totalSeconds / 60)} min
          in total
        </Text>
      </Card>

      <Card style={{ gap: spacing.sm }}>
        <Text variant="h4">Sections</Text>
        {test.sections.map((s) => {
          const r = result.sections.find((x) => x.key === s.key);
          return (
            <View key={s.key} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="small">{s.title}</Text>
              <Text variant="small">
                {r?.correct ?? 0}/{r?.total ?? s.questions.length} · {Math.round((r?.seconds ?? 0) / 60)} min
              </Text>
            </View>
          );
        })}
      </Card>

      <Card style={{ gap: spacing.sm }}>
        <Text variant="h4">By topic</Text>
        {Object.entries(topics).map(([name, v]) => (
          <View key={name} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="small">{name}</Text>
            <Text variant="small" color={v.right / v.all < 0.6 ? colors.destructive : colors.foreground}>
              {v.right}/{v.all}
            </Text>
          </View>
        ))}
        {weak.length ? (
          <Text variant="small" color={colors.mutedForeground}>
            Revise: {weak.join(', ')}
          </Text>
        ) : (
          <Text variant="small" color={colors.success}>
            No weak topics. Nice work.
          </Text>
        )}
      </Card>

      {test.coding.problems.length ? (
        <Card style={{ gap: spacing.sm }}>
          <Text variant="h4">Coding (self-reported)</Text>
          {test.coding.problems.map((p) => (
            <View key={p.key} style={{ gap: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="small">{p.title}</Text>
                <Text variant="small">{CODING_LABEL[status[p.key] ?? 'none']}</Text>
              </View>
              <Text variant="label" color={colors.mutedForeground}>
                {result.coding.find((c) => c.key === p.key)?.approach}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}

      <Button
        label={review ? 'Hide answers' : 'Review answers'}
        variant="outline"
        onPress={() => setReview((v) => !v)}
      />
      {review
        ? test.sections.map((s) => {
            const r = result.sections.find((x) => x.key === s.key);
            return (
              <View key={s.key} style={{ gap: spacing.sm }}>
                <Text variant="h4">{s.title}</Text>
                {s.questions.map((q, i) => {
                  const picked = answers[s.key][i];
                  const key = r?.review[i];
                  const ok = picked === key?.correctIndex;
                  return (
                    <Card key={i} style={{ gap: spacing.xs }}>
                      <Text variant="body">
                        {i + 1}. {q.question}
                      </Text>
                      <Text variant="small" color={ok ? colors.success : colors.destructive}>
                        Your answer: {picked >= 0 ? q.options[picked] : 'Not answered'}
                      </Text>
                      {!ok && key ? (
                        <Text variant="small" color={colors.success}>
                          Correct: {q.options[key.correctIndex]}
                        </Text>
                      ) : null}
                      {key?.explanation ? (
                        <Text variant="small" color={colors.mutedForeground}>
                          {key.explanation}
                        </Text>
                      ) : null}
                    </Card>
                  );
                })}
              </View>
            );
          })
        : null}
      <Button label="Done" onPress={onExit} />
    </View>
  );
}

function MockTestRunner({ test }: { test: MockTest }) {
  const router = useRouter();
  const [submit, { data: result, isLoading, isError }] = useSubmitMockAttemptMutation();

  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [answers, setAnswers] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(test.sections.map((s) => [s.key, s.questions.map(() => -1)])),
  );
  const [seconds, setSeconds] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, CodingStatus>>({});
  const codingSeconds = useRef(0);

  const payload = (): MockAttemptInput => ({
    sections: test.sections.map((s) => ({ key: s.key, answers: answers[s.key], seconds: seconds[s.key] ?? 0 })),
    coding: test.coding.problems.map((p) => ({ key: p.key, status: status[p.key] ?? 'none' })),
    codingSeconds: codingSeconds.current,
  });
  const send = () => submit({ testId: test.id, body: payload() });

  const finish = (secs: number) => {
    codingSeconds.current = secs;
    setPhase({ kind: 'report' });
    // State has not re-rendered yet, so build the body from the latest values directly.
    submit({ testId: test.id, body: { ...payload(), codingSeconds: secs } });
  };

  const submitSection = (index: number, secs: number) => {
    const section = test.sections[index];
    setSeconds((prev) => ({ ...prev, [section.key]: secs }));
    if (index + 1 < test.sections.length) return setPhase({ kind: 'section', index: index + 1 });
    if (test.coding.problems.length) return setPhase({ kind: 'coding' });
    // No coding round: the last section's time is not in state yet, so send it explicitly.
    setPhase({ kind: 'report' });
    submit({
      testId: test.id,
      body: {
        ...payload(),
        sections: test.sections.map((s) => ({
          key: s.key,
          answers: answers[s.key],
          seconds: s.key === section.key ? secs : (seconds[s.key] ?? 0),
        })),
      },
    });
  };

  const running = phase.kind === 'section' || phase.kind === 'coding';
  const current = phase.kind === 'section' ? test.sections[phase.index] : null;

  return (
    <Screen scroll padded>
      <ScreenHeader
        title={test.title}
        subtitle={phase.kind === 'report' ? 'Your result' : test.company}
        showBack={!running}
      />
      {phase.kind === 'intro' ? (
        <Intro test={test} onStart={() => setPhase({ kind: 'section', index: 0 })} />
      ) : null}
      {phase.kind === 'section' && current ? (
        <SectionRunner
          key={current.key}
          section={current}
          position={phase.index + 1}
          total={test.sections.length}
          answers={answers[current.key]}
          onAnswer={(qi, oi) =>
            setAnswers((prev) => ({
              ...prev,
              [current.key]: prev[current.key].map((a, i) => (i === qi ? oi : a)),
            }))
          }
          onSubmit={(secs) => submitSection(phase.index, secs)}
        />
      ) : null}
      {phase.kind === 'coding' ? (
        <CodingRound
          test={test}
          status={status}
          onStatus={(key, s) => setStatus((prev) => ({ ...prev, [key]: s }))}
          onFinish={finish}
        />
      ) : null}
      {phase.kind === 'report' ? (
        <Report
          test={test}
          answers={answers}
          status={status}
          result={result}
          isLoading={isLoading}
          isError={isError}
          onRetry={send}
          onExit={() => router.replace('/(protected)/mock-tests' as any)}
        />
      ) : null}
    </Screen>
  );
}

export default function MockTestRunScreen() {
  const { testId } = useLocalSearchParams<{ testId: string }>();
  const { data, isLoading, isError, refetch } = useGetMockTestQuery(String(testId));

  if (!data) {
    return (
      <Screen padded>
        <ScreenHeader title="Mock Test" showBack />
        <QueryState
          isLoading={isLoading}
          isError={isError || !isLoading}
          onRetry={refetch}
          errorMessage="Could not load this test."
        >
          {null}
        </QueryState>
      </Screen>
    );
  }
  return <MockTestRunner test={data} />;
}
