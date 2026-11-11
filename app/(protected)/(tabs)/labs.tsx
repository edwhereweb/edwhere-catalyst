import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { LabCard } from '@/components/labs/LabCard';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { SearchField } from '@/components/ui/SearchField';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetLabsQuery } from '@/store/api/gamificationApi';
import { useAppSelector } from '@/store/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import type { Lab } from '@/types/gamification';

export default function LabsScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const router = useRouter();
  const filters = useAppSelector((state) => state.labFilters);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const { data: labs, isLoading, isError, isFetching, refetch } = useGetLabsQuery({
    search: query,
    filters,
  });

  return (
    <Screen padded>
      <ScreenHeader
        title="Labs"
        trailing={
          <Button
            label="New Lab"
            icon="add"
            size="sm"
            fullWidth={false}
            onPress={() => router.push('/(protected)/labs/create' as any)}
          />
        }
      />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
        <SearchField
          value={search}
          onChangeText={setSearch}
          onSubmit={() => setQuery(search.trim())}
          placeholder="Search labs…"
          style={{ flex: 1 }}
        />
        <IconButton
          icon="options-outline"
          accessibilityLabel="Filter labs"
          color={colors.primaryForeground}
          style={{ backgroundColor: colors.primary, width: 52, height: 52, borderRadius: radii.xl }}
          onPress={() => router.push('/(protected)/labs/filter' as any)}
        />
      </View>
      <View style={{ flex: 1 }}>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          loadingMessage="Loading labs…"
          errorMessage="Could not load labs."
        >
          <FlatList<Lab>
            data={labs}
            keyExtractor={(lab) => lab.id}
            contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={refetch}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState title="No labs found" message="Try adjusting your search or filters." />
            }
            renderItem={({ item }) => (
              <LabCard lab={item} onPress={() => router.push(`/(protected)/labs/${item.id}` as any)} />
            )}
          />
        </QueryState>
      </View>
    </Screen>
  );
}
