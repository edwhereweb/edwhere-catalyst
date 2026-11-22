import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { AttachmentField } from '@/components/projects/AttachmentField';
import { EDITABLE, STATE_BADGE } from '@/components/projects/stageState';
import { useGetProjectQuery, useSaveProjectStageMutation } from '@/store/api/projectsApi';
import { useTheme } from '@/theme/ThemeProvider';
import type { ProjectAttachment } from '@/types/projects';

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export default function ProjectStageScreen() {
  const { projectId, stageId } = useLocalSearchParams<{ projectId: string; stageId: string }>();
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const router = useRouter();
  const { data: project, isLoading, isError, refetch } = useGetProjectQuery(projectId);
  const [save, { isLoading: isSaving, error: saveError }] = useSaveProjectStageMutation();

  const stage = project?.stages.find((s) => s.id === stageId);
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  const initialised = useRef(false);

  // Seed the form from the saved draft once; later refetches must not overwrite what the student is typing.
  useEffect(() => {
    if (stage && !initialised.current) {
      initialised.current = true;
      setText(stage.submission?.text ?? '');
      setAttachments(stage.submission?.attachments ?? []);
      setNote(stage.submission?.studentNote ?? '');
    }
  }, [stage]);

  const editable = !!stage && EDITABLE.includes(stage.state);
  const revision = stage?.submission?.revision ?? 1;
  const revised = revision > 1;
  // Mirrors the server: a file stage gets a few extra slots after feedback, a text stage gets supporting files.
  const cap = !stage
    ? 0
    : stage.inputType === 'file'
      ? revised
        ? Math.min(stage.maxFiles + 5, 10)
        : stage.maxFiles
      : revised
        ? 5
        : 0;
  const words = wordCount(text);
  const named = attachments.every((a) => a.name.trim().length > 0);
  const valid = !stage
    ? false
    : named &&
      (stage.inputType === 'text'
        ? words > 0 &&
          (!stage.minWords || words >= stage.minWords) &&
          (!stage.maxWords || words <= stage.maxWords)
        : attachments.length >= 1);

  const serverMessage = (saveError as { data?: { error?: { message?: string } } } | undefined)?.data?.error
    ?.message;

  const send = async (submit: boolean) => {
    if (!stage) return;
    setNotice('');
    const result = await save({
      projectId,
      stageId: stage.id,
      submit,
      ...(stage.inputType === 'text' ? { text } : {}),
      attachments: attachments.map(({ url, name, description }) => ({
        url,
        name: name.trim(),
        description,
      })),
      studentNote: note.trim() || undefined,
    });
    if (!('data' in result)) return;
    if (submit) router.back();
    else setNotice('Draft saved.');
  };

  const badge = stage ? STATE_BADGE[stage.state] : null;

  return (
    <Screen scroll padded>
      <ScreenHeader title={stage ? `Stage ${stage.order}` : 'Stage'} showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError || !stage}
        onRetry={refetch}
        errorMessage="Could not load this stage."
      >
        {stage && badge ? (
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="h2" style={{ flex: 1 }}>
                {stage.title}
              </Text>
              <Badge label={badge.label} variant={badge.variant} />
            </View>
            <Text variant="label" color={colors.xp}>
              {stage.points} pts
            </Text>
            <Text variant="body" color={colors.mutedForeground}>
              {stage.instructions}
            </Text>

            {stage.rubric.length ? (
              <Card style={{ gap: spacing.xs }}>
                <Text variant="h4">How this is graded</Text>
                {stage.rubric.map((r) => {
                  const given = stage.submission?.rubricScores.find((s) => s.criterionId === r.id);
                  return (
                    <View key={r.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text variant="small" style={{ flex: 1 }}>
                        {r.label}
                      </Text>
                      <Text variant="small" color={colors.mutedForeground}>
                        {stage.state === 'approved' && given ? `${given.score} / ${r.maxPoints}` : `${r.maxPoints} pts`}
                      </Text>
                    </View>
                  );
                })}
              </Card>
            ) : null}

            {stage.state === 'approved' ? (
              <Text variant="small" color={colors.success}>
                Approved with {stage.submission?.score ?? 0}/{stage.points} points.
                {stage.submission?.feedback ? ` Instructor: ${stage.submission.feedback}` : ''}
              </Text>
            ) : null}
            {stage.state === 'changes_requested' && stage.submission?.feedback ? (
              <View
                style={{ padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.destructive + '18' }}
              >
                <Text variant="small" color={colors.destructive}>
                  Instructor note: {stage.submission.feedback}
                </Text>
              </View>
            ) : null}
            {stage.state === 'submitted' ? (
              <Text variant="small" color={colors.warning}>
                Submitted. Your instructor will review it before the next stage opens.
              </Text>
            ) : null}

            {stage.inputType === 'text' ? (
              <View style={{ gap: spacing.xs }}>
                <Input
                  label="Your submission"
                  value={text}
                  onChangeText={setText}
                  editable={editable}
                  multiline
                  placeholder="Write here"
                  style={{ minHeight: 200, textAlignVertical: 'top', paddingTop: spacing.sm }}
                />
                <Text
                  variant="label"
                  color={
                    (stage.maxWords && words > stage.maxWords) || (stage.minWords && words < stage.minWords)
                      ? colors.destructive
                      : colors.mutedForeground
                  }
                >
                  {words} words
                  {stage.minWords ? ` · min ${stage.minWords}` : ''}
                  {stage.maxWords ? ` · max ${stage.maxWords}` : ''}
                </Text>
              </View>
            ) : null}

            {cap > 0 || attachments.length > 0 ? (
              <View style={{ gap: spacing.xs }}>
                {stage.inputType === 'text' ? (
                  <Text variant="small" color={colors.mutedForeground}>
                    Supporting files: add anything that shows what you changed.
                  </Text>
                ) : null}
                <AttachmentField
                  projectId={projectId}
                  stageId={stage.id}
                  value={attachments}
                  onChange={setAttachments}
                  revision={revision}
                  cap={cap}
                  disabled={!editable}
                />
              </View>
            ) : null}

            {editable && revised ? (
              <Input
                label="What did you change? (optional)"
                value={note}
                onChangeText={setNote}
                maxLength={500}
                multiline
                placeholder="A short note for your instructor about how you addressed the feedback"
                style={{ minHeight: 80, textAlignVertical: 'top', paddingTop: spacing.sm }}
              />
            ) : null}

            {saveError ? (
              <Text variant="label" color={colors.destructive} accessibilityRole="alert">
                {serverMessage ?? 'Could not save. Please try again.'}
              </Text>
            ) : null}
            {notice ? (
              <Text variant="label" color={colors.success}>
                {notice}
              </Text>
            ) : null}

            {editable ? (
              <View style={{ gap: spacing.sm }}>
                <Button
                  label={stage.state === 'changes_requested' ? 'Resubmit for review' : 'Submit for review'}
                  loading={isSaving}
                  disabled={!valid}
                  onPress={() => send(true)}
                />
                <Button
                  label="Save draft"
                  variant="outline"
                  disabled={isSaving}
                  onPress={() => send(false)}
                />
              </View>
            ) : null}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
