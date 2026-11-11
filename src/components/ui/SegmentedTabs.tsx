import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface Props {
  tabs: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}

/** Underlined tab row, as used on the Jobs screen. */
export function SegmentedTabs({ tabs, value, onChange }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }}
    >
      {tabs.map((tab) => {
        const selected = tab.key === value;
        return (
          <TouchableOpacity
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.key)}
            style={{
              paddingVertical: spacing.sm + 4,
              paddingHorizontal: spacing.md,
              marginBottom: -1,
              borderBottomWidth: 2,
              borderBottomColor: selected ? colors.primary : 'transparent',
            }}
          >
            <Text variant="button" color={selected ? colors.primary : colors.mutedForeground}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
