import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useGetPlacementProfileQuery } from '@/store/api/placementApi';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IconName) {
  function TabIcon({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const { colors } = theme;
  const router = useRouter();
  const { data: placementProfile } = useGetPlacementProfileQuery();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: theme.typography.label,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home-outline') }} />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: tabIcon('briefcase-outline'),
          href: placementProfile?.isActive ? undefined : null,
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push('/(protected)/placement' as any);
          },
        }}
      />
      <Tabs.Screen name="labs" options={{ title: 'Labs', tabBarIcon: tabIcon('terminal-outline') }} />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progress', tabBarIcon: tabIcon('stats-chart-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person-outline') }}
      />
    </Tabs>
  );
}
