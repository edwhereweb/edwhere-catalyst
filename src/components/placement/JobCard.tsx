import React from 'react';
import { View, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';
import type { Job } from '@/types/placement';

interface Props {
  job: Job;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Maps job tag variants to colors derived from theme */
function useTagColors(variant: Job['tags'][number]['variant']) {
  const { theme } = useTheme();
  const { colors } = theme;
  const map = {
    primary: { bg: colors.surfaceContainerLow, fg: colors.primary, border: colors.primary + '20' },
    secondary: { bg: colors.xpLight, fg: colors.secondary, border: colors.secondary + '20' },
    tertiary: { bg: colors.successLight, fg: colors.success, border: colors.success + '20' },
  };
  return map[variant];
}

function JobTag({ label, variant }: Job['tags'][number]) {
  const { theme } = useTheme();
  const tagColors = useTagColors(variant);

  return (
    <View
      style={{
        backgroundColor: tagColors.bg,
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: tagColors.border,
        paddingHorizontal: theme.spacing.sm + 4,
        paddingVertical: theme.spacing.xs,
      }}
    >
      <Text variant="label" color={tagColors.fg}>
        {label}
      </Text>
    </View>
  );
}

export function JobCard({ job, onPress, style }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radii, shadows } = theme;

  const timeAgo = formatTimeAgo(job.postedAt);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radii['2xl'],
          padding: spacing.md + 8,
          borderWidth: 1,
          borderColor: colors.border + '40',
          ...shadows.card,
        },
        style,
      ]}
    >
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', gap: spacing.md, flex: 1 }}>
          {/* Company logo */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radii.xl,
              backgroundColor: colors.surfaceContainerLow,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border + '30',
            }}
          >
            {job.companyLogoUrl ? (
              <Image
                source={{ uri: job.companyLogoUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Text variant="h4" color={colors.primary}>
                {job.company.charAt(0)}
              </Text>
            )}
          </View>

          {/* Title + company */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text variant="h4" color={colors.foreground} numberOfLines={1}>
              {job.title}
            </Text>
            <Text variant="small" color={colors.mutedForeground} numberOfLines={1}>
              {job.company}
            </Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md + 4 }}>
        {job.tags.map((tag, i) => (
          <JobTag key={i} {...tag} />
        ))}
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: spacing.sm + 4,
          borderTopWidth: 1,
          borderTopColor: colors.border + '30',
        }}
      >
        <Text variant="label" color={colors.mutedForeground + 'aa'}>
          🕐 {timeAgo}
        </Text>
        <Text variant="label" color={colors.primary} style={{ textDecorationLine: 'underline' }}>
          View →
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `Posted ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Posted ${days}d ago`;
}
