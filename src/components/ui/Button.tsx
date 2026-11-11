import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'ghost'
  | 'tonal'
  | 'highlight'
  | 'onHero';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Stretches across its container. Turn off for compact inline buttons. */
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
}: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;

  const variantStyles: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.primary, fg: colors.primaryForeground },
    secondary: { bg: colors.secondary, fg: colors.secondaryForeground },
    outline: { bg: 'transparent', fg: colors.primary, border: colors.primary },
    destructive: { bg: colors.destructive, fg: colors.destructiveForeground },
    ghost: { bg: 'transparent', fg: colors.primary },
    tonal: { bg: colors.surfaceContainer, fg: colors.primary },
    highlight: { bg: colors.highlight, fg: colors.onHighlight },
    onHero: { bg: 'transparent', fg: colors.heroForeground, border: colors.heroForeground + '55' },
  };

  const v = variantStyles[variant];
  const height = size === 'sm' ? 40 : 52;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          backgroundColor: v.bg,
          borderRadius: radii.lg,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border,
          minHeight: height,
          paddingHorizontal: size === 'sm' ? spacing.md : spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={v.fg} /> : null}
          <Text variant="button" color={v.fg} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
