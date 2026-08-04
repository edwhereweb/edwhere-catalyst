import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Screen({ children, scroll = false, padded = true, style }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const inner: StyleProp<ViewStyle> = [
    { flex: 1, backgroundColor: colors.background },
    padded && { paddingHorizontal: spacing.md },
    style,
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {scroll ? <ScrollView style={inner}>{children}</ScrollView> : <View style={inner}>{children}</View>}
    </SafeAreaView>
  );
}
