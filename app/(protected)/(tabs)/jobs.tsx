import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetJobsQuery } from '@/store/api/placementApi';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { JobCard } from '@/components/placement/JobCard';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Text } from '@/components/ui/Text';
import { LoadingView } from '@/components/feedback/LoadingView';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useTheme } from '@/theme/ThemeProvider';
import type { Job } from '@/types/placement';

export default function JobsScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { data: jobs, isLoading, isError, refetch, isFetching } = useGetJobsQuery({ search: query });

  function renderContent() {
    if (isLoading) return <LoadingView message="Finding opportunities…" />;
    if (isError) return <ErrorState onRetry={refetch} message="Could not load jobs. Please retry." />;

    return (
      <FlatList<Job>
        data={jobs}
        keyExtractor={(job) => job.id}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          jobs?.length ? (
            <Card tone="hero" style={{ gap: spacing.xs }}>
              <Text variant="label" color={colors.heroMuted}>
                Recommended for you
              </Text>
              <Text variant="h2" color={colors.heroForeground}>
                {jobs.length} {jobs.length === 1 ? 'new opportunity' : 'new opportunities'}
              </Text>
            </Card>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState title="No jobs found" message="Try a different search." />
        }
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => router.push(`/(protected)/placement/${item.id}` as any)} />
        )}
      />
    );
  }

  return (
    <PlacementAccessGate>
      <Screen scroll={false} padded>
        <ScreenHeader title="Find Jobs" />
        <SearchField
          value={search}
          onChangeText={setSearch}
          onSubmit={() => setQuery(search.trim())}
          placeholder="Search roles or locations…"
        />
        <View style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
          <SegmentedTabs
            tabs={[
              { key: 'discover', label: 'Discover' },
              { key: 'applied', label: 'Applied' },
            ]}
            value="discover"
            onChange={(key) => {
              if (key === 'applied') router.push('/(protected)/placement/applications' as any);
            }}
          />
        </View>
        <View style={{ flex: 1 }}>{renderContent()}</View>
      </Screen>
    </PlacementAccessGate>
  );
}
