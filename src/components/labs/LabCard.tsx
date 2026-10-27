import React from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';
import type { Lab, LabDifficulty } from '@/types/gamification';

const difficultyVariant = {
  easy: 'success',
  medium: 'warning',
  hard: 'destructive',
} as const satisfies Record<LabDifficulty, 'success' | 'warning' | 'destructive'>;

interface Props {
  lab: Lab;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function LabCard({ lab, onPress, style }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="button">
      <Card style={[{ gap: spacing.sm }, style]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Badge label={lab.field} variant="info" />
          <Badge label={lab.difficulty} variant={difficultyVariant[lab.difficulty]} />
        </View>
        <Text variant="h4">{lab.title}</Text>
        <Text variant="small" color={colors.mutedForeground} numberOfLines={2}>
          {lab.description}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
            <Text variant="label" color={colors.mutedForeground}>
              {lab.hours} hrs
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Ionicons name="star" size={16} color={colors.xp} />
            <Text variant="label" color={colors.xp}>
              {lab.points} pts
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
          {lab.tags.map((tag) => (
            <Text key={tag} variant="label" color={colors.primary}>
              #{tag}
            </Text>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
