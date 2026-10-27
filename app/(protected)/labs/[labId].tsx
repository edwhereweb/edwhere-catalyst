import React, { useState } from 'react';
import { View } from 'react-native';
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

export default function LabDetailsScreen() {
  const { labId } = useLocalSearchParams<{ labId: string }>();
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { data: lab, isLoading, isError, refetch } = useGetLabByIdQuery(labId);
  const [submitProof, { isLoading: isSubmitting, isSuccess, isError: submitFailed }] =
    useSubmitLabProofMutation();
  const [flag, setFlag] = useState('');
  const [started, setStarted] = useState(false);

  const canSubmit = started && flag.trim().length > 0;

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
          <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Badge label={lab.field} variant="info" />
              <Badge label={lab.difficulty} variant="success" />
            </View>
            <Text variant="h2">Lab: {lab.title}</Text>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Text variant="small" color={colors.mutedForeground}>
                ⏱ {lab.hours} hrs
              </Text>
              {lab.environment ? (
                <Text variant="small" color={colors.mutedForeground}>
                  🖥 {lab.environment}
                </Text>
              ) : null}
            </View>

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

            <Card style={{ gap: spacing.xs }}>
              <Text variant="h4">Environment</Text>
              {lab.targetVm ? <Text variant="small">Target VM: {lab.targetVm}</Text> : null}
              {lab.tools ? <Text variant="small">Tools: {lab.tools}</Text> : null}
              {lab.network ? <Text variant="small">Network: {lab.network}</Text> : null}
            </Card>

            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="h4">Submission</Text>
                <Badge
                  label={isSuccess ? 'submitted' : lab.submissionStatus ?? 'pending'}
                  variant={isSuccess || lab.submissionStatus === 'approved' ? 'success' : 'warning'}
                />
              </View>
              <Text variant="small" color={colors.mutedForeground}>
                To complete this lab, provide the root flag found on the target machine.
              </Text>
              <Input
                label="Enter Flag"
                value={flag}
                onChangeText={setFlag}
                autoCapitalize="none"
                autoCorrect={false}
                editable={started}
              />
              {submitFailed ? (
                <Text variant="label" color={colors.destructive}>
                  Could not submit your proof. Please try again.
                </Text>
              ) : null}
            </Card>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button
                label={started ? 'Lab Started' : 'Start Lab'}
                variant="outline"
                disabled={started}
                onPress={() => setStarted(true)}
                style={{ flex: 1 }}
              />
              <Button
                label="Submit Proof"
                loading={isSubmitting}
                disabled={!canSubmit}
                onPress={() => submitProof({ id: lab.id, flag: flag.trim() })}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
