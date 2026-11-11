import React from 'react';
import { View, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import type { Job } from '@/types/placement';

interface Props {
  job: Job;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

function JobTag({ label, variant }: Job['tags'][number]) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;
  const map = {
    primary: { bg: colors.primaryLight, fg: colors.primary },
    secondary: { bg: colors.xpLight, fg: colors.xp },
    tertiary: { bg: colors.successLight, fg: colors.success },
  };
  const tone = map[variant];

  return (
    <View
      style={{
        backgroundColor: tone.bg,
        borderRadius: radii.md,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs,
      }}
    >
      <Text variant="label" color={tone.fg}>
        {label}
      </Text>
    </View>
  );
}

export function JobCard({ job, onPress, style }: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radii, shadows } = theme;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${job.title} at ${job.company}`}
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radii.xl,
          padding: spacing.screen,
          borderWidth: 1,
          borderColor: colors.outlineVariant + '55',
          gap: spacing.md,
          ...shadows.card,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radii.lg,
            backgroundColor: colors.surfaceContainer,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {job.companyLogoUrl ? (
            <Image
              source={{ uri: job.companyLogoUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Text variant="h3" color={colors.primary}>
              {job.company.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h4" numberOfLines={2}>
            {job.title}
          </Text>
          <Text variant="small" color={colors.mutedForeground} numberOfLines={1}>
            {job.company}
          </Text>
        </View>
      </View>

      {job.tags.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {job.tags.map((tag, i) => (
            <JobTag key={i} {...tag} />
          ))}
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.outlineVariant + '70',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
          <Text variant="label" color={colors.mutedForeground}>
            {formatTimeAgo(job.postedAt)}
          </Text>
        </View>
        <Button label="View" size="sm" fullWidth={false} onPress={onPress} style={{ minWidth: 88 }} />
      </View>
    </TouchableOpacity>
  );
}

function formatTimeAgo(iso: string): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return 'Recently posted';
  const hours = Math.max(0, Math.floor((Date.now() - time) / 3_600_000));
  if (hours < 1) return 'Posted just now';
  if (hours < 24) return `Posted ${hours}h ago`;
  return `Posted ${Math.floor(hours / 24)}d ago`;
}
