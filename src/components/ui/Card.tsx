import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Tone = 'default' | 'tinted' | 'hero';

interface Props {
  children: React.ReactNode;
  /** default: white card. tinted: soft blue panel. hero: dark slate feature card. */
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, tone = 'default', style }: Props) {
  const { theme } = useTheme();
  const { colors, radii, shadows, spacing } = theme;

  const toneStyle: ViewStyle =
    tone === 'hero'
      ? { backgroundColor: colors.hero, borderWidth: 0 }
      : tone === 'tinted'
        ? {
            backgroundColor: colors.surfaceContainerLow,
            borderWidth: 1,
            borderColor: colors.outlineVariant + '70',
          }
        : {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.outlineVariant + '55',
            ...shadows.card,
          };

  return (
    <View
      style={[
        {
          borderRadius: radii.xl,
          padding: spacing.screen,
          overflow: 'hidden',
          ...toneStyle,
        },
        style,
      ]}
    >
      {tone === 'hero' ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -60,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.heroForeground,
            opacity: 0.06,
          }}
        />
      ) : null}
      {children}
    </View>
  );
}
