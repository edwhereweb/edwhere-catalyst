import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Dashboard entry point to the mock test list. */
export function MockTestCard() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconTile icon="timer-outline" tone="primary" />
        <View style={{ flex: 1 }}>
          <Text variant="h4">Company Mock Tests</Text>
          <Text variant="small" color={colors.mutedForeground}>
            Timed MCQ sections and a coding round, modelled on real company tests.
          </Text>
        </View>
      </View>
      <Button label="Take a Mock Test" onPress={() => router.push('/(protected)/mock-tests' as any)} />
    </Card>
  );
}
