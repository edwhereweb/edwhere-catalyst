import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  letter: string;
  label: string;
  chosen: boolean;
  /** Set after grading: true = the right answer, false = the user's wrong pick. */
  state?: 'correct' | 'wrong';
  disabled?: boolean;
  onPress: () => void;
}

/** One answer choice: lettered badge, tinted when picked, green/red once graded. */
export function OptionButton({ letter, label, chosen, state, disabled, onPress }: Props) {
  const { colors, spacing, radii } = useTheme().theme;
  const accent = state === 'correct' ? colors.success : state === 'wrong' ? colors.destructive : colors.primary;
  const tint = state === 'correct' ? colors.successLight : colors.primaryLight;
  const on = chosen || !!state;

  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ selected: chosen }}
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 4,
        minHeight: 56,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.lg,
        borderWidth: 1.5,
        borderColor: on ? accent : colors.outlineVariant,
        backgroundColor: on ? tint : colors.card,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: on ? accent : colors.muted,
        }}
      >
        {state ? (
          <Ionicons name={state === 'correct' ? 'checkmark' : 'close'} size={16} color="#ffffff" />
        ) : (
          <Text variant="label" color={on ? '#ffffff' : colors.mutedForeground}>
            {letter}
          </Text>
        )}
      </View>
      <Text variant="small" style={{ flex: 1 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
