import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;

  const variantStyles: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.primary, fg: colors.primaryForeground },
    secondary: { bg: colors.secondary, fg: colors.secondaryForeground },
    outline: { bg: 'transparent', fg: colors.primary, border: colors.primary },
    destructive: { bg: colors.destructive, fg: colors.destructiveForeground },
    ghost: { bg: 'transparent', fg: colors.primary },
  };

  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          backgroundColor: v.bg,
          borderRadius: radii.lg,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border,
          paddingVertical: spacing.sm + 4,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? undefined : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <Text variant="button" color={v.fg}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
