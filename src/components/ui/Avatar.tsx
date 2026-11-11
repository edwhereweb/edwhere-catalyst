import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { initials } from '@/utils/format';
import { Text } from './Text';

interface Props {
  name: string;
  size?: number;
  highlighted?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name, size = 40, highlighted = false, style }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  // The same name always gets the same colour, so people are recognisable at a glance.
  const palette = [colors.primary, colors.secondary, colors.success, colors.streak, colors.badge];
  const hash = Array.from(name).reduce((n, ch) => n + ch.charCodeAt(0), 0);
  const background = highlighted ? colors.primary : palette[hash % palette.length];

  return (
    <View
      accessibilityLabel={name}
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.radii.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
        },
        style,
      ]}
    >
      <Text
        variant="label"
        color="#ffffff"
        style={{ fontSize: Math.max(11, Math.round(size * 0.36)), lineHeight: size, letterSpacing: 0 }}
      >
        {initials(name)}
      </Text>
    </View>
  );
}
