import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';
import type { ApplicationStatus } from '@/types/placement';

interface Props {
  status: ApplicationStatus;
  style?: StyleProp<ViewStyle>;
}

type StatusMeta = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  bg: (colors: ReturnType<typeof useTheme>['theme']['colors']) => string;
  fg: (colors: ReturnType<typeof useTheme>['theme']['colors']) => string;
};

const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  applied: {
    label: 'Applied',
    icon: 'paper-plane-outline',
    bg: (c) => c.infoLight,
    fg: (c) => c.info,
  },
  interviewing: {
    label: 'Interviewing',
    icon: 'mic-outline',
    bg: (c) => c.xpLight,
    fg: (c) => c.xp,
  },
  shortlisted: {
    label: 'Shortlisted',
    icon: 'star-outline',
    bg: (c) => c.streakLight,
    fg: (c) => c.streak,
  },
  offer: {
    label: 'Offer',
    icon: 'trophy-outline',
    bg: (c) => c.successLight,
    fg: (c) => c.success,
  },
  rejected: {
    label: 'Rejected',
    icon: 'close-circle-outline',
    bg: (c) => c.destructive + '20',
    fg: (c) => c.destructive,
  },
  withdrawn: {
    label: 'Withdrawn',
    icon: 'arrow-undo-outline',
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
      <Ionicons name={meta.icon} size={14} color={meta.fg(colors)} />
      <Text
        variant="label"
        color={meta.fg(colors)}
        style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        {meta.label}
      </Text>
    </View>
  );
}
