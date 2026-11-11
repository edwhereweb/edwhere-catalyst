import React from 'react';
import { View, TextInput, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function SearchField({ value, onChangeText, onSubmit, placeholder = 'Search', style }: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing, shadows } = theme;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          minHeight: 52,
          paddingHorizontal: spacing.md,
          borderRadius: radii.xl,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.outlineVariant + '80',
          ...shadows.sm,
        },
        style,
      ]}
    >
      <Ionicons name="search" size={20} color={colors.mutedForeground} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={[
          { flex: 1, height: 48, color: colors.foreground, ...theme.typography.body },
          // Web draws a heavy focus outline around the bare input; the card border is the affordance.
          { outlineStyle: 'none' } as object,
        ]}
      />
    </View>
  );
}
