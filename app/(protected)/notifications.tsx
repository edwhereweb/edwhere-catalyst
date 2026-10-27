import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRelativeTime } from '@/utils/format';
import type { AppNotification, NotificationCategory } from '@/types/gamification';

type Filter = 'all' | NotificationCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'alerts', label: 'Alerts' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'social', label: 'Social' },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery();
  const [markAllRead, { isLoading: isMarking }] = useMarkAllNotificationsReadMutation();

  const items = (data ?? []).filter((item) => filter === 'all' || item.category === filter);

  return (
    <Screen padded>
      <ScreenHeader title="Notifications" showBack showNotifications={false} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }}>
        {FILTERS.map((item) => (
          <Chip
            key={item.value}
            label={item.label}
            selected={filter === item.value}
            onPress={() => setFilter(item.value)}
          />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          errorMessage="Could not load notifications."
        >
          <FlatList<AppNotification>
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl, flexGrow: 1 }}
            ListEmptyComponent={<EmptyState title="You're all caught up" />}
            ListHeaderComponent={
              items.some((item) => !item.read) ? (
                <Button
                  label="Mark all as read"
                  variant="ghost"
                  loading={isMarking}
                  onPress={() => markAllRead()}
                />
              ) : null
            }
            renderItem={({ item }) => (
              <Card
                style={{
                  gap: spacing.xs,
                  borderLeftWidth: 4,
                  borderLeftColor: item.read ? colors.outlineVariant : colors.primary,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant="h4" style={{ flex: 1 }}>
                    {item.title}
                  </Text>
                  <Text variant="label" color={colors.mutedForeground}>
                    {formatRelativeTime(item.createdAt)}
                  </Text>
                </View>
                <Text variant="small" color={colors.mutedForeground}>
                  {item.body}
                </Text>
                {item.actionLabel && item.actionRoute ? (
                  <TouchableOpacity onPress={() => router.push(item.actionRoute as any)}>
                    <Text variant="button" color={colors.primary}>
                      {item.actionLabel}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </Card>
            )}
          />
        </QueryState>
      </View>
    </Screen>
  );
}
