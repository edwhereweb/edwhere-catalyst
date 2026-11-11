import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { Card } from './Card';
import { IconTile, IconTone } from './IconTile';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  tone?: IconTone;
  title: string;
  subtitle: string;
  actionLabel: string;
  onPress: () => void;
}

/** Card with a leading icon tile, a title and subtitle, and a compact action button. */
export function ActionRow({ icon, tone = 'primary', title, subtitle, actionLabel, onPress }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
      <IconTile icon={icon} tone={tone} size={48} />
      <View style={{ flex: 1 }}>
        <Text variant="h4" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="small" color={colors.mutedForeground} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <Button label={actionLabel} size="sm" fullWidth={false} onPress={onPress} style={{ minWidth: 72 }} />
    </Card>
  );
}
