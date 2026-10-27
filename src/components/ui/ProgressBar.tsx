import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  value: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, color, style }: Props) {
  const { theme } = useTheme();
  const percent = Math.min(100, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={[
        {
          height: theme.spacing.sm,
          borderRadius: theme.radii.full,
          backgroundColor: theme.colors.surfaceContainerHigh,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${percent}%`,
          height: '100%',
          borderRadius: theme.radii.full,
          backgroundColor: color ?? theme.colors.primary,
        }}
      />
    </View>
  );
}
