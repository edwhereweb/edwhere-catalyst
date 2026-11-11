import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { IconTile } from '../ui/IconTile';

interface Props {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'Nothing here yet',
  message,
  actionLabel,
  onAction,
}: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
      }}
    >
      <IconTile icon="file-tray-outline" tone="neutral" size={64} />
      <Text variant="h4" color={theme.colors.foreground} style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {message ? (
        <Text variant="small" color={theme.colors.mutedForeground} style={{ textAlign: 'center' }}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="outline" style={{ alignSelf: 'center', minWidth: 200 }} />
      ) : null}
    </View>
  );
}
