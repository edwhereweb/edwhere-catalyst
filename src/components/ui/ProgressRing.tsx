import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  /** 0 to 100 */
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SEGMENTS = 64;

/** Circular progress drawn from dots, so it needs no SVG dependency. Starts at 12 o'clock, clockwise. */
export function ProgressRing({
  value,
  size = 72,
  stroke = 8,
  color,
  trackColor,
  children,
  style,
}: Props) {
  const { theme } = useTheme();
  const percent = Math.min(100, Math.max(0, value));
  const filled = Math.round((percent / 100) * SEGMENTS);
  const fill = color ?? theme.colors.primary;
  const track = trackColor ?? theme.colors.surfaceContainerHigh;
  const radius = size / 2;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percent) }}
      style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: stroke,
          borderColor: track,
        }}
      />
      {Array.from({ length: filled }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: radius - stroke / 2,
            top: radius - stroke / 2,
            width: stroke,
            height: stroke,
            borderRadius: stroke / 2,
            backgroundColor: fill,
            transform: [{ rotate: `${(i * 360) / SEGMENTS}deg` }, { translateY: -(radius - stroke / 2) }],
          }}
        />
      ))}
      {children}
    </View>
  );
}
