import React from 'react';
import { View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGetMyApplicationsQuery } from '@/store/api/placementApi';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { ApplicationStatusBadge } from '@/components/placement/ApplicationStatusBadge';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { LoadingView } from '@/components/feedback/LoadingView';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useTheme } from '@/theme/ThemeProvider';
import type { JobApplication } from '@/types/placement';

export default function ApplicationsScreen() {
  const { theme } = useTheme();
  const { spacing } = theme;
  const router = useRouter();

  const { data: applications, isLoading, isError, refetch } = useGetMyApplicationsQuery();

  return (
    <PlacementAccessGate>
      <Screen scroll={false} padded>
        <ScreenHeader title="My Applications" showBack />

        {isLoading ? (
          <LoadingView message="Loading your applications…" />
        ) : isError ? (
          <ErrorState onRetry={refetch} message="Could not load applications." />
        ) : !applications?.length ? (
          <EmptyState
            title="No applications yet"
            message="Start applying to jobs and track your progress here."
            actionLabel="Browse Jobs"
            onAction={() => router.navigate('/(protected)/(tabs)/jobs' as any)}
          />
        ) : (
          <FlatList<JobApplication>
            data={applications}
            keyExtractor={(a) => a.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl }}
            renderItem={({ item }) => <ApplicationCard application={item} />}
          />
        )}
      </Screen>
    </PlacementAccessGate>
  );
}

function ApplicationCard({ application }: { application: JobApplication }) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  const parsedDate = new Date(application.appliedAt);
  const appliedDate = Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radii.lg,
            backgroundColor: colors.surfaceContainer,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text variant="h4" color={colors.primary}>
            {application.company.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h4" numberOfLines={2}>
            {application.jobTitle}
          </Text>
          <Text variant="small" color={colors.mutedForeground} numberOfLines={1}>
            {application.company}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing.sm,
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.outlineVariant + '70',
        }}
      >
        <View style={{ flex: 1, gap: spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Ionicons name="calendar-outline" size={14} color={colors.mutedForeground} />
            <Text variant="label" color={colors.mutedForeground}>
              Applied {appliedDate}
            </Text>
          </View>
          {application.notes ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Ionicons name="document-text-outline" size={14} color={colors.mutedForeground} />
              <Text variant="label" color={colors.mutedForeground} numberOfLines={1} style={{ flex: 1 }}>
                {application.notes}
              </Text>
            </View>
          ) : null}
        </View>
        <ApplicationStatusBadge status={application.status} />
      </View>
    </Card>
  );
}
