import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';

interface Props {
  message?: string;
}

export function LoadingView({ message }: Props) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm }}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      {message ? (
        <Text variant="small" color={theme.colors.mutedForeground}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
