import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'secondary';

interface Props {
  label: string;
  variant?: BadgeVariant;
  /** Status badges are uppercase; turn off for names such as skills. */
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ label, variant = 'default', uppercase = true, style }: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;

  const variantMap: Record<BadgeVariant, { bg: string; fg: string }> = {
    default: { bg: colors.muted, fg: colors.mutedForeground },
    success: { bg: colors.successLight, fg: colors.success },
    warning: { bg: colors.warningLight, fg: colors.warning },
    destructive: { bg: colors.destructive + '20', fg: colors.destructive },
    info: { bg: colors.infoLight, fg: colors.info },
    secondary: { bg: colors.xpLight, fg: colors.xp },
  };

  const v = variantMap[variant];

  return (
    <View
      style={[
        {
          backgroundColor: v.bg,
          borderRadius: radii.full,
          paddingHorizontal: spacing.sm + 4,
          paddingVertical: spacing.xs,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text variant="label" color={v.fg} style={uppercase ? { textTransform: 'uppercase', letterSpacing: 0.5 } : undefined}>
        {label}
      </Text>
    </View>
  );
}
