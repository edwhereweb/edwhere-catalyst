import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Career Match — Static Placeholder Screen
 *
 * This screen displays a "coming soon" placeholder for the Career Match
 * feature. No API calls are made at this stage. The feature will eventually
 * analyse the student's completed courses, certifications, and skills to
 * recommend the best-fit job roles.
 */
export default function CareerMatchScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const router = useRouter();

  const FEATURES = [
    {
      icon: '🎯',
      title: 'Skill-to-Job Matching',
      desc: 'Automatically maps your completed courses and certifications to relevant job requirements.',
    },
    {
      icon: '📊',
      title: 'Match Score',
      desc: 'Get a % compatibility score for every listing so you know where to focus your applications.',
    },
    {
      icon: '💡',
      title: 'Gap Analysis',
      desc: 'Understand exactly which skills you need to improve your match score for target roles.',
    },
    {
      icon: '🚀',
      title: 'Personalised Recommendations',
      desc: 'Receive curated job alerts based on your academic profile and career preferences.',
    },
  ];

  return (
    <PlacementAccessGate>
      <Screen scroll={false} padded={false}>
        {/* Back nav */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
          }}
        >
          <Text
            variant="body"
            color={colors.primary}
            onPress={router.back}
          >
            ← Back
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingBottom: spacing['3xl'],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero banner */}
          <View
            style={{
              backgroundColor: colors.inverseSurface,
              borderRadius: radii['2xl'],
              padding: spacing.xl,
              alignItems: 'center',
              marginBottom: spacing.lg,
              overflow: 'hidden',
            }}
          >
            <Text style={{ fontSize: 56, marginBottom: spacing.sm }}>🔮</Text>
            <Badge label="Coming Soon" variant="info" style={{ marginBottom: spacing.md }} />
            <Text
              variant="h2"
              color={colors.inverseOnSurface}
              style={{ textAlign: 'center', marginBottom: spacing.sm }}
            >
              Career Match
            </Text>
            <Text
              variant="body"
              color={colors.inverseOnSurface + 'bb'}
              style={{ textAlign: 'center', lineHeight: 24 }}
            >
              We&apos;re building an intelligent career matching engine that aligns your
              Edwhere learning journey with the perfect job opportunities.
            </Text>
          </View>

          {/* Features preview */}
          <Text
            variant="h4"
            color={colors.foreground}
            style={{ marginBottom: spacing.md }}
          >
            What to expect
          </Text>

          <View style={{ gap: spacing.sm }}>
            {FEATURES.map((f, i) => (
              <Card key={i} style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radii.xl,
                    backgroundColor: colors.surfaceContainerLow,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{f.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="h4" color={colors.foreground} style={{ marginBottom: 4 }}>
                    {f.title}
                  </Text>
                  <Text variant="small" color={colors.mutedForeground} style={{ lineHeight: 20 }}>
                    {f.desc}
                  </Text>
                </View>
              </Card>
            ))}
          </View>

          {/* ETA note */}
          <View
            style={{
              marginTop: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors.infoLight,
              borderRadius: radii.lg,
              borderLeftWidth: 4,
              borderLeftColor: colors.info,
            }}
          >
            <Text variant="small" color={colors.info} style={{ lineHeight: 20 }}>
              💙 Career Match is in active development. You&apos;ll be notified as soon as it
              launches. Keep building your skills — every course brings you closer to your
              dream role!
            </Text>
          </View>
        </ScrollView>
      </Screen>
    </PlacementAccessGate>
  );
}
