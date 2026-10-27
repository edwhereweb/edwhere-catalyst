import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { IconButton } from './IconButton';
import { Text } from './Text';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showNotifications?: boolean;
}

export function ScreenHeader({ title, subtitle, showBack = false, showNotifications = true }: Props) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
      }}
    >
      {showBack ? (
        <IconButton icon="arrow-back" accessibilityLabel="Go back" onPress={router.back} />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text variant="h2" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="small" color={theme.colors.mutedForeground}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showNotifications ? (
        <IconButton
          icon="notifications-outline"
          accessibilityLabel="Notifications"
          onPress={() => router.push('/(protected)/notifications' as any)}
        />
      ) : null}
    </View>
  );
}
