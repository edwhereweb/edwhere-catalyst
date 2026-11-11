import React, { useContext } from 'react';
import { View, ScrollView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
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
  const insets = useSafeAreaInsets();
  // Inside the tab navigator the tab bar already clears the home indicator.
  const inTabs = useContext(BottomTabBarHeightContext) !== undefined;
  const bottom = inTabs ? 0 : insets.bottom;
  const horizontal = padded ? spacing.screen : 0;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {scroll ? (
        <ScrollView
          style={[{ flex: 1, backgroundColor: colors.background }, style]}
          contentContainerStyle={{
            paddingHorizontal: horizontal,
            paddingBottom: spacing.xl + bottom,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            {
              flex: 1,
              backgroundColor: colors.background,
              paddingHorizontal: horizontal,
              paddingBottom: bottom,
            },
            style,
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
