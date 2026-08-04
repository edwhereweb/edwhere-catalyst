import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/ThemeProvider';

type TypographyVariant = keyof Theme['typography'];

interface Props extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

export function Text({ variant = 'body', color, style, ...props }: Props) {
  const { theme } = useTheme();
  const typographyStyle = theme.typography[variant];
  return (
    <RNText
      style={[typographyStyle, { color: color ?? theme.colors.foreground }, style]}
      {...props}
    />
  );
}
