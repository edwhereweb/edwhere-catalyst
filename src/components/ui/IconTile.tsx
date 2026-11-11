import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

export type IconTone = 'primary' | 'violet' | 'green' | 'amber' | 'red' | 'neutral';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  tone?: IconTone;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** Icon inside a softly tinted rounded square, used to lead cards and list rows. */
export function IconTile({ icon, tone = 'primary', size = 44, style }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const tones: Record<IconTone, { bg: string; fg: string }> = {
    primary: { bg: colors.primaryLight, fg: colors.primary },
    violet: { bg: colors.xpLight, fg: colors.xp },
    green: { bg: colors.successLight, fg: colors.success },
    amber: { bg: colors.warningLight, fg: colors.warning },
    red: { bg: colors.destructive + '22', fg: colors.destructive },
    neutral: { bg: colors.surfaceContainer, fg: colors.onSurfaceVariant },
  };
  const t = tones[tone];

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.radii.lg,
          backgroundColor: t.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={Math.round(size * 0.5)} color={t.fg} />
    </View>
  );
}
