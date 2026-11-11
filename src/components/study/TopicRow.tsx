import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';
import type { StudyTopicSummary } from '@/types/study';

interface Props {
  topic: StudyTopicSummary;
  onPress: () => void;
  /** Drops the tinted background when the row already sits on a tinted surface. */
  plain?: boolean;
}

export function TopicRow({ topic, onPress, plain = false }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${topic.title}, ${topic.done ? 'completed' : 'not started'}`}
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: 60,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: plain ? 0 : spacing.md,
        borderRadius: radii.lg,
        backgroundColor: plain ? 'transparent' : colors.surfaceContainerLow,
      }}
    >
      <Ionicons
        name={topic.done ? 'checkmark-circle' : 'ellipse-outline'}
        size={26}
        color={topic.done ? colors.success : colors.mutedForeground}
      />
      <View style={{ flex: 1 }}>
        <Text
          variant="body"
          numberOfLines={2}
          color={topic.done ? colors.mutedForeground : undefined}
        >
          {topic.title}
        </Text>
        <Text variant="label" color={colors.mutedForeground}>
          {topic.moduleTitle} · {topic.estMinutes} min
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}
