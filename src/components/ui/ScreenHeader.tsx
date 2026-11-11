import React from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useGetNotificationsQuery } from '@/store/api/gamificationApi';
import { IconButton } from './IconButton';
import { Text } from './Text';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  /** Shown on the right of the title row, for example a text action. */
  trailing?: React.ReactNode;
  /** Sits beside the notification bell in the top bar, for example a streak pill. */
  accessory?: React.ReactNode;
}

function BellButton() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data } = useGetNotificationsQuery();
  const unread = data?.some((n) => !n.read) ?? false;

  return (
    <View>
      <IconButton
        icon="notifications-outline"
        accessibilityLabel={unread ? 'Notifications, unread' : 'Notifications'}
        color={theme.colors.foreground}
        onPress={() => router.push('/(protected)/notifications' as any)}
      />
      {unread ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 8,
            right: 9,
            width: 9,
            height: 9,
            borderRadius: 5,
            backgroundColor: theme.colors.destructive,
            borderWidth: 1.5,
            borderColor: theme.colors.background,
          }}
        />
      ) : null}
    </View>
  );
}

/** The Edwhere logo on a white chip, so the navy swirl stays visible in dark mode too. */
function BrandMark({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel="Edwhere Catalyst"
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radii.md,
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        }}
      >
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
      </View>
      <Text variant={compact ? 'h4' : 'h3'} color={colors.foreground}>
        Edwhere <Text variant={compact ? 'h4' : 'h3'} color={colors.primary}>Catalyst</Text>
      </Text>
    </View>
  );
}

/** Branded top bar (logo, or back arrow, plus notifications) followed by the page title. */
export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  showNotifications = true,
  trailing,
  accessory,
}: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();

  return (
    <View style={{ paddingBottom: spacing.md }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
        }}
      >
        {showBack ? (
          <IconButton
            icon="arrow-back"
            accessibilityLabel="Go back"
            color={colors.primary}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/' as any))}
            style={{ marginLeft: -spacing.sm }}
          />
        ) : (
          <BrandMark />
        )}
        {showBack ? <BrandMark compact /> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          {accessory}
          {showNotifications ? (
            <View style={{ marginRight: -spacing.sm }}>
              <BellButton />
            </View>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: spacing.md,
          marginTop: spacing.sm,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="h1" accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="small" color={colors.mutedForeground} style={{ marginTop: spacing.xs }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing}
      </View>
    </View>
  );
}
