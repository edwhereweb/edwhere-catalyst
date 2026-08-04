import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';

/**
 * Shown when a student navigates to the Placement module but does not have
 * `hasPlacementAccess` enabled by their institution's admin.
 */
export function RestrictedAccessView() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
      }}
    >
      <Card
        style={{
          alignItems: 'center',
          padding: spacing.xl,
          gap: spacing.md,
          maxWidth: 360,
        }}
      >
        {/* Lock illustration */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: theme.radii.full,
            backgroundColor: colors.infoLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
          }}
        >
          <Text variant="h1" style={{ fontSize: 36 }}>
            🔒
          </Text>
        </View>

        <Text
          variant="h3"
          color={colors.foreground}
          style={{ textAlign: 'center' }}
        >
          Placement Access Required
        </Text>

        <Text
          variant="body"
          color={colors.mutedForeground}
          style={{ textAlign: 'center', lineHeight: 24 }}
        >
          You don&apos;t have placement access yet. Please contact your institution&apos;s
          administrator to enable this feature for your account.
        </Text>

        <View
          style={{
            marginTop: spacing.sm,
            padding: spacing.md,
            backgroundColor: colors.infoLight,
            borderRadius: theme.radii.lg,
            borderLeftWidth: 4,
            borderLeftColor: colors.info,
            width: '100%',
          }}
        >
          <Text variant="small" color={colors.info} style={{ lineHeight: 20 }}>
            💡 Once enabled, you&apos;ll be able to browse job listings, apply for roles, and
            track your application statuses.
          </Text>
        </View>
      </Card>
    </View>
  );
}
