import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { IconTile, IconTone } from '@/components/ui/IconTile';
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
type IconName = React.ComponentProps<typeof IconTile>['icon'];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'alerts', label: 'Alerts' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'social', label: 'Social' },
];

const CATEGORY_STYLE: Record<NotificationCategory, { icon: IconName; tone: IconTone }> = {
  alerts: { icon: 'alert-circle-outline', tone: 'amber' },
  achievements: { icon: 'trophy-outline', tone: 'green' },
  social: { icon: 'people-outline', tone: 'violet' },
};

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery();
  const [markAllRead, { isLoading: isMarking }] = useMarkAllNotificationsReadMutation();

  const items = (data ?? []).filter((item) => filter === 'all' || item.category === filter);
  const hasUnread = (data ?? []).some((item) => !item.read);

  return (
    <Screen padded>
      <ScreenHeader
        title="Notifications"
        showBack
        showNotifications={false}
        trailing={
          hasUnread ? (
            <Button
              label="Mark all read"
              variant="tonal"
              size="sm"
              fullWidth={false}
              loading={isMarking}
              onPress={() => markAllRead()}
            />
          ) : undefined
        }
      />
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
            contentContainerStyle={{ gap: spacing.sm + 2, paddingBottom: spacing.xl, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState title="You're all caught up" />}
            renderItem={({ item }) => {
              const style = CATEGORY_STYLE[item.category];
              return (
                <Card
                  style={{
                    flexDirection: 'row',
                    gap: spacing.md,
                    borderLeftWidth: 4,
                    borderLeftColor: item.read ? colors.outlineVariant : colors.primary,
                  }}
                >
                  <IconTile icon={style.icon} tone={style.tone} />
                  <View style={{ flex: 1, gap: spacing.xs }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
                      <Text variant="h4" style={{ flex: 1 }} numberOfLines={2}>
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
                      <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() => router.push(item.actionRoute as any)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={{ alignSelf: 'flex-start' }}
                      >
                        <Text variant="button" color={colors.primary}>
                          {item.actionLabel}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </Card>
              );
            }}
          />
        </QueryState>
      </View>
    </Screen>
  );
}
