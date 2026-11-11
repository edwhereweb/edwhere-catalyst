import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetJobByIdQuery, useApplyForJobMutation } from '@/store/api/placementApi';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LoadingView } from '@/components/feedback/LoadingView';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useTheme } from '@/theme/ThemeProvider';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Requirements from the API may carry an Ionicons name or a plain glyph. */
function RequirementIcon({ icon }: { icon: string }) {
  const { theme } = useTheme();
  const { colors } = theme;
  if (/^[a-z][a-z0-9-]*$/.test(icon)) {
    return <Ionicons name={icon as IconName} size={22} color={colors.highlight} />;
  }
  return <Text style={{ fontSize: 18 }}>{icon}</Text>;
}

export default function JobDetailScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { theme } = useTheme();
  const { colors, spacing, radii, shadows } = theme;
  const insets = useSafeAreaInsets();

  const { data: job, isLoading, isError, refetch } = useGetJobByIdQuery(jobId ?? '', {
    skip: !jobId,
  });
  const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation();
  const [applied, setApplied] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  if (!jobId) {
    return <ErrorState message="This job could not be found." />;
  }

  if (isLoading) return <LoadingView message="Loading job details…" />;
  if (isError || !job) return <ErrorState onRetry={refetch} />;

  const handleApply = async () => {
    setApplicationError('');
    try {
      await applyForJob({ jobId: job.id }).unwrap();
      setApplied(true);
    } catch (error) {
      const responseError = error as { data?: { error?: { message?: string } } };
      setApplicationError(
        responseError.data?.error?.message ?? 'Could not submit your application. Please try again.',
      );
    }
  };

  return (
    <PlacementAccessGate>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Screen scroll padded>
          <ScreenHeader title={job.title} subtitle={`${job.company} · ${job.location}`} showBack />
          <View style={{ gap: spacing.md, paddingBottom: 96 }}>
            {job.tags.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {job.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    label={tag.label}
                    uppercase={false}
                    variant={tag.variant === 'tertiary' ? 'success' : tag.variant === 'secondary' ? 'secondary' : 'info'}
                  />
                ))}
              </View>
            ) : null}

            {job.description ? (
              <Card style={{ gap: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <IconTile icon="document-text-outline" tone="primary" />
                  <Text variant="h4">Job Description</Text>
                </View>
                <Text variant="body" color={colors.mutedForeground}>
                  {job.description}
                </Text>
                {job.responsibilities?.length ? (
                  <View style={{ gap: spacing.sm }}>
                    <Text variant="label" color={colors.foreground}>
                      KEY RESPONSIBILITIES
                    </Text>
                    {job.responsibilities.map((r, i) => (
                      <View key={i} style={{ flexDirection: 'row', gap: spacing.sm }}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text variant="small" color={colors.mutedForeground} style={{ flex: 1 }}>
                          {r}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </Card>
            ) : null}

            {job.requirements?.length ? (
              <Card tone="hero" style={{ gap: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons name="ribbon-outline" size={24} color={colors.highlight} />
                  <Text variant="h4" color={colors.heroForeground}>
                    Requirements
                  </Text>
                </View>
                {job.requirements.map((req, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: spacing.md,
                      backgroundColor: colors.heroForeground + '12',
                      borderRadius: radii.lg,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radii.md,
                        backgroundColor: colors.heroForeground + '1f',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RequirementIcon icon={req.icon} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="button" color={colors.heroForeground}>
                        {req.label}
                      </Text>
                      <Text variant="label" color={colors.heroMuted} style={{ letterSpacing: 0 }}>
                        {req.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card>
            ) : null}

            <Card tone="tinted" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text variant="h4">Career Match</Text>
                <Text variant="small" color={colors.mutedForeground}>
                  {job.careerMatchPercent != null
                    ? `Your profile matches ${job.careerMatchPercent}% of requirements.`
                    : 'Coming soon — based on your profile and skills.'}
                </Text>
              </View>
              {job.careerMatchPercent != null ? (
                <ProgressRing value={job.careerMatchPercent} size={72} stroke={8}>
                  <Text variant="label" color={colors.primary} style={{ letterSpacing: 0 }}>
                    {job.careerMatchPercent}%
                  </Text>
                </ProgressRing>
              ) : (
                <Badge label="Soon" variant="info" />
              )}
            </Card>
          </View>
        </Screen>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.card,
            paddingHorizontal: spacing.screen,
            paddingTop: spacing.md,
            paddingBottom: Math.max(insets.bottom, spacing.md),
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            gap: spacing.sm,
            ...shadows.lg,
          }}
        >
          {applicationError ? (
            <Text variant="small" color={colors.destructive} accessibilityRole="alert">
              {applicationError}
            </Text>
          ) : null}
          <Button
            label={applied ? 'Applied' : 'Apply Now'}
            icon={applied ? 'checkmark' : 'arrow-forward'}
            onPress={handleApply}
            loading={isApplying}
            disabled={applied}
          />
        </View>
      </View>
    </PlacementAccessGate>
  );
}
