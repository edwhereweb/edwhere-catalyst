import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';
import type { Dashboard } from '@/types/gamification';

// Where each readiness step is done in the app.
const STEP_ROUTES: Record<string, string> = {
  study: '/(protected)/study/roadmap',
  lab: '/(protected)/(tabs)/labs',
  profile: '/(protected)/edit-profile',
  resume: '/(protected)/edit-profile',
  application: '/(protected)/placement/log-application',
  daily: '/(protected)/daily',
};

export function ReadinessCard({ readiness }: { readiness: Dashboard['readiness'] }) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const next = readiness.next;

  return (
    <Card tone="hero" style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text variant="label" color={colors.heroMuted}>
            PLACEMENT READINESS
          </Text>
          <Text variant="h3" color={colors.heroForeground}>
            {readiness.percent >= 100 ? 'You are placement-ready' : `${readiness.percent}% ready`}
          </Text>
          <Text variant="small" color={colors.heroMuted}>
            {next
              ? `Next best step: ${next.label} (+${next.gain}%)`
              : 'Keep your streak going to stay sharp.'}
          </Text>
        </View>
        <ProgressRing
          value={readiness.percent}
          size={92}
          stroke={9}
          color={colors.highlight}
          trackColor={colors.heroForeground + '33'}
        >
          <Text variant="h3" color={colors.heroForeground}>
            {readiness.percent}%
          </Text>
        </ProgressRing>
      </View>
      {next && STEP_ROUTES[next.key] ? (
        <Button
          label="Do it now"
          icon="arrow-forward"
          variant="highlight"
          onPress={() => router.push(STEP_ROUTES[next.key] as any)}
        />
      ) : null}
    </Card>
  );
}
