import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetJobByIdQuery, useApplyForJobMutation } from '@/store/api/placementApi';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingView } from '@/components/feedback/LoadingView';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useTheme } from '@/theme/ThemeProvider';

export default function JobDetailScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { theme } = useTheme();
  const { colors, spacing, radii, shadows } = theme;
  const router = useRouter();

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
      <Screen scroll={false} padded={false}>
        {/* Back nav */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
            backgroundColor: colors.background + 'e0',
          }}
        >
          <TouchableOpacity onPress={router.back} style={{ padding: spacing.xs }}>
            <Text variant="h4" color={colors.primary}>
              ← Back
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingBottom: spacing['3xl'] + spacing.xl,
          }}
        >
          {/* Company + title hero */}
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: radii.xl,
                backgroundColor: colors.surfaceContainerLow,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.md,
                ...shadows.md,
              }}
            >
              <Text variant="h2" color={colors.primary}>
                {job.company.charAt(0)}
              </Text>
            </View>

            <Text variant="h3" color={colors.foreground} style={{ textAlign: 'center', marginBottom: 4 }}>
              {job.title}
            </Text>
            <Text variant="body" color={colors.primary} style={{ marginBottom: spacing.sm }}>
              {job.company}
            </Text>
            <Text variant="small" color={colors.mutedForeground} style={{ marginBottom: spacing.md }}>
              📍 {job.location}
            </Text>

            {/* Tags row */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'center' }}>
              {job.tags.map((tag, i) => (
                <Badge key={i} label={tag.label} />
              ))}
            </View>
          </View>

          {/* Description card */}
          {job.description ? (
            <Card style={{ marginBottom: spacing.md }}>
              <Text variant="h4" color={colors.foreground} style={{ marginBottom: spacing.sm }}>
                📄 Job Description
              </Text>
              <Text variant="body" color={colors.mutedForeground} style={{ lineHeight: 24 }}>
                {job.description}
              </Text>

              {job.responsibilities?.length ? (
                <>
                  <Text
                    variant="label"
                    color={colors.foreground}
                    style={{ marginTop: spacing.md, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.8 }}
                  >
                    Key Responsibilities
                  </Text>
                  {job.responsibilities.map((r, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs }}>
                      <Text variant="body" color={colors.primary}>✓</Text>
                      <Text variant="small" color={colors.mutedForeground} style={{ flex: 1 }}>
                        {r}
                      </Text>
                    </View>
                  ))}
                </>
              ) : null}
            </Card>
          ) : null}

          {/* Requirements card (dark focus style) */}
          {job.requirements?.length ? (
            <View
              style={{
                backgroundColor: colors.inverseSurface,
                borderRadius: radii.xl,
                padding: spacing.md + 8,
                marginBottom: spacing.md,
              }}
            >
              <Text variant="h4" color={colors.inverseOnSurface} style={{ marginBottom: spacing.md }}>
                ✅ Requirements
              </Text>
              {job.requirements.map((req, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: spacing.sm + 4,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: radii.lg,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    marginBottom: spacing.sm,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radii.md,
                      backgroundColor: colors.primary + '40',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{req.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="button" color={colors.inverseOnSurface}>
                      {req.label}
                    </Text>
                    <Text variant="label" color={colors.inverseOnSurface + '80'}>
                      {req.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {/* Career Match — static placeholder */}
          <Card
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: colors.primary + '25',
              backgroundColor: colors.surfaceContainerLow,
              marginBottom: spacing.md,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="h4" color={colors.foreground}>
                Career Match
              </Text>
              <Text variant="small" color={colors.mutedForeground}>
                Coming soon — based on your profile &amp; skills
              </Text>
            </View>
            <Badge label="Soon" variant="info" />
          </Card>
        </ScrollView>

        {/* Fixed action bar */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.card,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: colors.border + '40',
            ...shadows.lg,
            flexDirection: 'row',
            gap: spacing.sm,
          }}
        >
          {applicationError ? (
            <Text
              variant="small"
              color={colors.destructive}
              style={{ flex: 1, alignSelf: 'center' }}
            >
              {applicationError}
            </Text>
          ) : null}
          <Button
            label={applied ? '✓ Applied' : 'Apply Now →'}
            onPress={handleApply}
            loading={isApplying}
            disabled={applied}
            fullWidth
            style={{ flex: 1 }}
          />
        </View>
      </Screen>
    </PlacementAccessGate>
  );
}
