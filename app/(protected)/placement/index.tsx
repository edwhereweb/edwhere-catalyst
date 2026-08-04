import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetJobsQuery } from '@/store/api/placementApi';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { JobCard } from '@/components/placement/JobCard';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { LoadingView } from '@/components/feedback/LoadingView';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useTheme } from '@/theme/ThemeProvider';
import type { Job } from '@/types/placement';

const NAV_TABS = ['Discover', 'Saved', 'Applied'] as const;
type NavTab = (typeof NAV_TABS)[number];

export default function PlacementIndexScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii, shadows } = theme;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NavTab>('Discover');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data: jobs, isLoading, isError, refetch, isFetching } = useGetJobsQuery(
    { search },
    { skip: activeTab !== 'Discover' },
  );

  const handleSearch = () => setSearch(searchInput);

  function renderContent() {
    if (activeTab !== 'Discover') {
      return (
        <EmptyState
          title={`${activeTab} coming soon`}
          message="This tab will show your relevant jobs."
        />
      );
    }
    if (isLoading) return <LoadingView message="Finding opportunities…" />;
    if (isError) return <ErrorState onRetry={refetch} message="Could not load jobs. Please retry." />;
    if (!jobs?.length) {
      return <EmptyState title="No jobs found" message="Try adjusting your search." />;
    }

    return (
      <FlatList<Job>
        data={jobs}
        keyExtractor={(j) => j.id}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: colors.inverseSurface,
              borderRadius: radii['2xl'],
              padding: spacing.md + 8,
              marginBottom: spacing.sm,
              overflow: 'hidden',
            }}
          >
            <Text variant="label" color={colors.inverseOnSurface + 'bb'} style={{ marginBottom: 4 }}>
              Recommended for you
            </Text>
            <Text variant="h3" color={colors.inverseOnSurface}>
              {jobs.length} New Opportunities
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => router.push(`/(protected)/placement/${item.id}`)}
          />
        )}
      />
    );
  }

  return (
    <PlacementAccessGate>
      <Screen scroll={false} padded>
        {/* Header */}
        <Text variant="h2" style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
          Find Jobs
        </Text>

        {/* Search bar */}
        <View
          style={{
            flexDirection: 'row',
            gap: spacing.sm,
            marginBottom: spacing.md,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: radii.xl,
              borderWidth: 1,
              borderColor: colors.border + '60',
              paddingHorizontal: spacing.md,
              ...shadows.sm,
            }}
          >
            <Text style={{ fontSize: 16, marginRight: spacing.xs }}>🔍</Text>
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              placeholder="Search roles, companies…"
              placeholderTextColor={colors.mutedForeground}
              style={{
                flex: 1,
                height: 48,
                ...theme.typography.body,
                color: colors.foreground,
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(protected)/placement/applications')}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radii.xl,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              ...shadows.md,
            }}
          >
            <Text style={{ fontSize: 20 }}>📋</Text>
          </TouchableOpacity>
        </View>

        {/* Nav tabs */}
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.border + '50',
            marginBottom: spacing.md,
          }}
        >
          {NAV_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingVertical: spacing.sm + 2,
                paddingHorizontal: spacing.md,
                borderBottomWidth: 3,
                borderBottomColor: activeTab === tab ? colors.primary : 'transparent',
              }}
            >
              <Text
                variant="button"
                color={activeTab === tab ? colors.primary : colors.mutedForeground}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>{renderContent()}</View>
      </Screen>
    </PlacementAccessGate>
  );
}
