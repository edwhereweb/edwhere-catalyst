import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { IconTile } from '../ui/IconTile';

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
      <IconTile icon="alert-circle-outline" tone="red" size={64} />
      <Text variant="body" color={theme.colors.foreground} style={{ textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry ? (
        <Button label="Try Again" icon="refresh" onPress={onRetry} variant="outline" style={{ alignSelf: 'center', minWidth: 200 }} />
      ) : null}
    </View>
  );
}
