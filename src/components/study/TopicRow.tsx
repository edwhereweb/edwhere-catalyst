import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';
import type { StudyTopicSummary } from '@/types/study';

interface Props {
  topic: StudyTopicSummary;
  onPress: () => void;
}

export function TopicRow({ topic, onPress }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
    >
      <Ionicons
        name={topic.done ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={topic.done ? colors.success : colors.mutedForeground}
      />
      <View style={{ flex: 1 }}>
        <Text variant="body" numberOfLines={2}>
          {topic.title}
        </Text>
        <Text variant="small" color={colors.mutedForeground}>
          {topic.moduleTitle} · {topic.estMinutes} min
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}
