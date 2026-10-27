import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, selected = false, onPress, style }: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected }}
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radii.full,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primary : colors.card,
        },
        style,
      ]}
    >
      <Text variant="label" color={selected ? colors.primaryForeground : colors.onSurfaceVariant}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
