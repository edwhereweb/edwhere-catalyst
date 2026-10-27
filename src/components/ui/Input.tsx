import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, error, containerStyle, style, onFocus, onBlur, ...props }: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      {label ? (
        <Text variant="label" color={colors.onSurfaceVariant}>
          {label}
        </Text>
      ) : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.mutedForeground}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          {
            minHeight: 48,
            paddingHorizontal: spacing.md,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: error ? colors.destructive : focused ? colors.ring : colors.border,
            backgroundColor: colors.input,
            color: colors.foreground,
            ...theme.typography.body,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Text variant="label" color={colors.destructive}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
