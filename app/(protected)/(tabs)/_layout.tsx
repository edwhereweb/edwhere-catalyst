import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface + 'cc',
          borderTopColor: colors.border + '50',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
