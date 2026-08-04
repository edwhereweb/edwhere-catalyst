import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: Props) {
  const { theme } = useTheme();
  const { colors, radii, shadows, spacing } = theme;

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radii.xl,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border + '40',
          ...shadows.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
