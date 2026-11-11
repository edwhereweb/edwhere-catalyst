import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetLabByIdQuery, useSubmitLabProofMutation } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import type { Lab } from '@/types/gamification';

type Status = NonNullable<Lab['submissionStatus']> | 'none';

const STATUS_BADGE = {
  none: { label: 'Not submitted', variant: 'default' },
  submitted: { label: 'In review', variant: 'warning' },
  approved: { label: 'Completed', variant: 'success' },
  rejected: { label: 'Needs changes', variant: 'destructive' },
} as const;

export default function LabDetailsScreen() {
  const { labId } = useLocalSearchParams<{ labId: string }>();
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { data: lab, isLoading, isError, refetch } = useGetLabByIdQuery(labId);
  const [submitProof, { isLoading: isSubmitting, error: submitError }] = useSubmitLabProofMutation();
  const [proof, setProof] = useState('');
  const [started, setStarted] = useState(false);

  const status: Status = lab?.submissionStatus ?? 'none';
  // Labs without an outside resource need no "start" step, and a returned proof is already started.
  const canWrite = started || !lab?.resourceUrl || status !== 'none';
  const finished = status === 'approved';
  const serverMessage = (submitError as { data?: { error?: { message?: string } } } | undefined)?.data
    ?.error?.message;

  const startLab = () => {
    if (lab?.resourceUrl) void Linking.openURL(lab.resourceUrl);
    setStarted(true);
  };

  return (
    <Screen scroll padded>
      <ScreenHeader title="Lab Details" showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError || !lab}
        onRetry={refetch}
        errorMessage="Could not load this lab."
      >
        {lab ? (
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Badge label={lab.field} variant="info" uppercase={false} />
              <Badge
                label={lab.difficulty}
                variant={lab.difficulty === 'hard' ? 'destructive' : lab.difficulty === 'medium' ? 'warning' : 'success'}
              />
            </View>
            <Text variant="h2">{lab.title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
                <Text variant="small" color={colors.mutedForeground}>
                  {lab.hours} hrs
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Ionicons name="star-outline" size={16} color={colors.xp} />
                <Text variant="small" color={colors.xp}>
                  {lab.points} pts
                </Text>
              </View>
              {lab.environment ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 }}>
                  <Ionicons name="desktop-outline" size={16} color={colors.mutedForeground} />
                  <Text variant="small" color={colors.mutedForeground} style={{ flexShrink: 1 }}>
                    {lab.environment}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text variant="body" color={colors.mutedForeground}>
              {lab.description}
            </Text>

            {lab.objectives?.length ? (
              <Card style={{ gap: spacing.sm }}>
                <Text variant="h4">Learning Objectives</Text>
                {lab.objectives.map((objective) => (
                  <View key={objective} style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text variant="small" style={{ flex: 1 }}>
                      {objective}
                    </Text>
                  </View>
                ))}
              </Card>
            ) : null}

            {lab.targetVm || lab.tools || lab.network ? (
              <Card style={{ gap: spacing.xs }}>
                <Text variant="h4">Environment</Text>
                {lab.targetVm ? <Text variant="small">Target VM: {lab.targetVm}</Text> : null}
                {lab.tools ? <Text variant="small">Tools: {lab.tools}</Text> : null}
                {lab.network ? <Text variant="small">Network: {lab.network}</Text> : null}
              </Card>
            ) : null}

            {lab.resourceUrl ? (
              <Button
                label={started || status !== 'none' ? 'Open lab again' : 'Start Lab'}
                icon="open-outline"
                variant={status === 'none' && !started ? 'primary' : 'outline'}
                onPress={startLab}
              />
            ) : null}

            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="h4">Submission</Text>
                <Badge {...STATUS_BADGE[status]} />
              </View>

              {finished ? (
                <Text variant="small" color={colors.success}>
                  Well done. You earned {lab.points} points for this lab.
                </Text>
              ) : (
                <>
                  <Text variant="small" color={colors.mutedForeground}>
                    {lab.autoGraded
                      ? 'To complete this lab, enter the flag you found.'
                      : 'Submit your proof from the description (a link, screenshot link or short notes). An instructor will review it.'}
                  </Text>
                  {status === 'rejected' && lab.reviewNote ? (
                    <View
                      style={{
                        padding: spacing.md,
                        borderRadius: theme.radii.lg,
                        backgroundColor: colors.destructive + '18',
                      }}
                    >
                      <Text variant="small" color={colors.destructive}>
                        Instructor note: {lab.reviewNote}
                      </Text>
                    </View>
                  ) : null}
                  {status === 'submitted' ? (
                    <Text variant="small" color={colors.warning}>
                      Your proof is waiting for review. You can update it below.
                    </Text>
                  ) : null}
                  <Input
                    label={lab.autoGraded ? 'Enter Flag' : 'Proof of completion'}
                    value={proof}
                    onChangeText={setProof}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={canWrite}
                    multiline={!lab.autoGraded}
                    placeholder={lab.autoGraded ? undefined : 'Paste a link or describe what you did'}
                    style={lab.autoGraded ? undefined : { minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.sm }}
                  />
                  {submitError ? (
                    <Text variant="label" color={colors.destructive} accessibilityRole="alert">
                      {serverMessage ?? 'Could not submit your proof. Please try again.'}
                    </Text>
                  ) : null}
                  <Button
                    label={status === 'none' ? 'Submit Proof' : 'Resubmit Proof'}
                    loading={isSubmitting}
                    disabled={!canWrite || proof.trim().length === 0}
                    onPress={async () => {
                      const result = await submitProof({ id: lab.id, flag: proof.trim() });
                      if ('data' in result) setProof('');
                    }}
                  />
                </>
              )}
            </Card>
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
