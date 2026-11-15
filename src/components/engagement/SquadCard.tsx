import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { Text } from '@/components/ui/Text';
import { useGetSquadQuery } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';

export function SquadCard() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data: squad, isLoading, isError } = useGetSquadQuery();
  if (isLoading || isError) return null;

  const open = () => router.push('/(protected)/squad' as any);

  if (!squad) {
    return (
      <Card style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <IconTile icon="people" tone="violet" />
          <View style={{ flex: 1 }}>
            <Text variant="h4">Study with friends</Text>
            <Text variant="small" color={colors.mutedForeground}>
              Join or start a squad of up to 5 and share a streak.
            </Text>
          </View>
        </View>
        <Button label="Set up my squad" variant="outline" icon="people-outline" onPress={open} />
      </Card>
    );
  }

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconTile icon="people" tone="violet" />
        <View style={{ flex: 1 }}>
          <Text variant="h4" numberOfLines={1}>
            {squad.name}
          </Text>
          <Text variant="small" color={colors.mutedForeground}>
            {squad.activeToday} of {squad.members.length} active today
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Ionicons name="flame" size={20} color={colors.streak} />
          <Text variant="h4" color={colors.streak}>
            {squad.streak}
          </Text>
        </View>
      </View>
      <Button label="Open squad" variant="tonal" onPress={open} />
    </Card>
  );
}
