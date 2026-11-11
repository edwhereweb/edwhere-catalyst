import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useGetPlacementProfileQuery } from '@/store/api/placementApi';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(active: IconName, inactive: IconName) {
  function TabIcon({ color, size, focused }: { color: string; size: number; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { data: placementProfile } = useGetPlacementProfileQuery();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
          borderTopWidth: 1,
          height: 68 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { ...theme.typography.label, fontSize: 11, lineHeight: 14, letterSpacing: 0 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: tabIcon('briefcase', 'briefcase-outline'),
          // Placement is access-controlled, so the tab only appears for approved students.
          href: placementProfile?.isActive ? undefined : null,
        }}
      />
      <Tabs.Screen name="labs" options={{ title: 'Labs', tabBarIcon: tabIcon('terminal', 'terminal-outline') }} />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progress', tabBarIcon: tabIcon('stats-chart', 'stats-chart-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
