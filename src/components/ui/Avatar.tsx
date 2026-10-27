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

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.radii.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: highlighted ? colors.primary : colors.surfaceContainerHigh,
        },
        style,
      ]}
    >
      <Text
        variant="label"
        color={highlighted ? colors.primaryForeground : colors.onSurfaceVariant}
      >
        {initials(name)}
      </Text>
    </View>
  );
}
