import React from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetMyApplicationsQuery } from '@/store/api/placementApi';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { ApplicationStatusBadge } from '@/components/placement/ApplicationStatusBadge';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { LoadingView } from '@/components/feedback/LoadingView';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useTheme } from '@/theme/ThemeProvider';
import type { JobApplication } from '@/types/placement';

export default function ApplicationsScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();

  const { data: applications, isLoading, isError, refetch } = useGetMyApplicationsQuery();

  return (
    <PlacementAccessGate>
      <Screen scroll={false} padded>
        {/* Back nav */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg }}>
          <Text
            variant="body"
            color={colors.primary}
            onPress={router.back}
            style={{ marginRight: spacing.md }}
          >
            ← Back
          </Text>
          <Text variant="h3">My Applications</Text>
        </View>

        {isLoading ? (
          <LoadingView message="Loading your applications…" />
        ) : isError ? (
          <ErrorState onRetry={refetch} message="Could not load applications." />
        ) : !applications?.length ? (
          <EmptyState
            title="No applications yet"
            message="Start applying to jobs and track your progress here."
            actionLabel="Browse Jobs"
            onAction={() => router.push('/(protected)/placement')}
          />
        ) : (
          <FlatList<JobApplication>
            data={applications}
            keyExtractor={(a) => a.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing['3xl'] }}
            renderItem={({ item }) => <ApplicationCard application={item} />}
          />
        )}
      </Screen>
    </PlacementAccessGate>
  );
}

function ApplicationCard({ application }: { application: JobApplication }) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const parsedDate = new Date(application.appliedAt);
  const appliedDate = Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card style={{ gap: spacing.xs }}>
      {/* Company logo placeholder + title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text variant="h4" color={colors.foreground} numberOfLines={1}>
            {application.jobTitle}
          </Text>
          <Text variant="small" color={colors.mutedForeground}>
            {application.company}
          </Text>
        </View>
        <ApplicationStatusBadge status={application.status} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: spacing.xs,
          paddingTop: spacing.xs + 2,
          borderTopWidth: 1,
          borderTopColor: colors.border + '30',
        }}
      >
        <Text variant="label" color={colors.mutedForeground}>
          Applied: {appliedDate}
        </Text>
        {application.notes ? (
          <Text variant="label" color={colors.mutedForeground} numberOfLines={1} style={{ maxWidth: 140 }}>
            📝 {application.notes}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}
