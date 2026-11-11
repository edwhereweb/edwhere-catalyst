import React from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';
import type { Lab, LabDifficulty } from '@/types/gamification';

const difficultyVariant = {
  easy: 'success',
  medium: 'warning',
  hard: 'destructive',
} as const satisfies Record<LabDifficulty, 'success' | 'warning' | 'destructive'>;

const STATUS_LABEL = {
  submitted: { label: 'In review', variant: 'warning' },
  approved: { label: 'Completed', variant: 'success' },
  rejected: { label: 'Needs changes', variant: 'destructive' },
} as const;

interface Props {
  lab: Lab;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function LabCard({ lab, onPress, style }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radii, shadows } = theme;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${lab.title}, ${lab.difficulty}, ${lab.hours} hours, ${lab.points} points`}
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radii.xl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.outlineVariant + '55',
          ...shadows.card,
        },
        style,
      ]}
    >
      <View
        style={{
          height: 104,
          backgroundColor: colors.hero,
          padding: spacing.md,
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -50,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: colors.heroForeground,
            opacity: 0.06,
          }}
        />
        <View style={{ alignItems: 'flex-end' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
              paddingHorizontal: spacing.sm + 2,
              paddingVertical: spacing.xs,
              borderRadius: radii.full,
              backgroundColor: colors.highlight,
            }}
          >
            <Ionicons name="star" size={13} color={colors.onHighlight} />
            <Text variant="label" color={colors.onHighlight} style={{ letterSpacing: 0 }}>
              {lab.points} pts
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View
            style={{
              paddingHorizontal: spacing.sm + 4,
              paddingVertical: spacing.xs,
              borderRadius: radii.full,
              backgroundColor: colors.primary,
              justifyContent: 'center',
            }}
          >
            <Text variant="label" color={colors.primaryForeground}>
              {lab.field}
            </Text>
          </View>
          <Badge label={lab.difficulty} variant={difficultyVariant[lab.difficulty]} />
          {lab.submissionStatus ? (
            <Badge
              label={STATUS_LABEL[lab.submissionStatus].label}
              variant={STATUS_LABEL[lab.submissionStatus].variant}
            />
          ) : null}
        </View>
      </View>

      <View style={{ padding: spacing.screen, gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
          <Text variant="h4" style={{ flex: 1 }} numberOfLines={2}>
            {lab.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
            <Text variant="label" color={colors.mutedForeground}>
              {lab.hours} hrs
            </Text>
          </View>
        </View>
        <Text variant="small" color={colors.mutedForeground} numberOfLines={3}>
          {lab.description}
        </Text>
        {lab.tags.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {lab.tags.map((tag) => (
              <View
                key={tag}
                style={{
                  paddingHorizontal: spacing.sm + 2,
                  paddingVertical: spacing.xs,
                  borderRadius: radii.md,
                  backgroundColor: colors.surfaceContainerLow,
                }}
              >
                <Text variant="label" color={colors.onSurfaceVariant}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
