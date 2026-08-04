import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
      }}
    >
      <Text variant="h3" color={theme.colors.destructive}>
        ⚠️
      </Text>
      <Text variant="body" color={theme.colors.foreground} style={{ textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry ? <Button label="Try Again" onPress={onRetry} variant="outline" /> : null}
    </View>
  );
}
