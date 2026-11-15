import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { Text } from '@/components/ui/Text';
import { useGetDailyQuery } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';

/** Daily 5: three quick questions that keep the streak going. Hidden until there is something to show. */
export function DailyCard() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data } = useGetDailyQuery();
  if (!data) return null;
  if (!data.done && data.questions.length === 0) return null;

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconTile icon="flash" tone="amber" />
        <View style={{ flex: 1 }}>
          <Text variant="h4">Daily 5</Text>
          <Text variant="small" color={colors.mutedForeground}>
            {data.done
              ? `Done today · ${data.score}/${data.total} correct`
              : '3 questions · about 2 minutes · earn points'}
          </Text>
        </View>
        {data.done ? <Badge label="Done" variant="success" /> : null}
      </View>
      {!data.done ? (
        <Button label="Play now" icon="play" onPress={() => router.push('/(protected)/daily' as any)} />
      ) : null}
    </Card>
  );
}
