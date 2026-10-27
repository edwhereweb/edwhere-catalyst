import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  accessibilityLabel: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({ icon, onPress, accessibilityLabel, color, style }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        {
          width: 40,
          height: 40,
          borderRadius: theme.radii.full,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={22} color={color ?? theme.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );
}
