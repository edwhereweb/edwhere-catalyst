import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';
import type { ApplicationStatus } from '@/types/placement';

interface Props {
  status: ApplicationStatus;
  style?: StyleProp<ViewStyle>;
}

type StatusMeta = {
  label: string;
  emoji: string;
  bg: (colors: ReturnType<typeof useTheme>['theme']['colors']) => string;
  fg: (colors: ReturnType<typeof useTheme>['theme']['colors']) => string;
};

const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  applied: {
    label: 'Applied',
    emoji: '📨',
    bg: (c) => c.infoLight,
    fg: (c) => c.info,
  },
  interviewing: {
    label: 'Interviewing',
    emoji: '🎙️',
    bg: (c) => c.xpLight,
    fg: (c) => c.xp,
  },
  shortlisted: {
    label: 'Shortlisted',
    emoji: '⭐',
    bg: (c) => c.streakLight,
    fg: (c) => c.streak,
  },
  offer: {
    label: 'Offer',
    emoji: '🎉',
    bg: (c) => c.successLight,
    fg: (c) => c.success,
  },
  rejected: {
    label: 'Rejected',
    emoji: '❌',
    bg: (c) => c.destructive + '20',
    fg: (c) => c.destructive,
  },
  withdrawn: {
    label: 'Withdrawn',
    emoji: '↩️',
    bg: (c) => c.muted,
    fg: (c) => c.mutedForeground,
  },
};

export function ApplicationStatusBadge({ status, style }: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;
  const meta = STATUS_META[status];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          backgroundColor: meta.bg(colors),
          borderRadius: radii.full,
          paddingHorizontal: spacing.sm + 4,
          paddingVertical: spacing.xs + 2,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 12 }}>{meta.emoji}</Text>
      <Text
        variant="label"
        color={meta.fg(colors)}
        style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}
      >
        {meta.label}
      </Text>
    </View>
  );
}
