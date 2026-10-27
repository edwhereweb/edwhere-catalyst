import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface Props {
  label: string;
  hint: string;
  fileName?: string;
  types: string[];
  maxSizeBytes: number;
  onChange: (fileName?: string) => void;
}

export function FilePicker({ label, hint, fileName, types, maxSizeBytes, onChange }: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;
  const [error, setError] = React.useState('');

  const pick = async () => {
    setError('');
    const result = await DocumentPicker.getDocumentAsync({ type: types, copyToCacheDirectory: true });
    if (result.canceled) return;
    const file = result.assets[0];
    if (file.size && file.size > maxSizeBytes) {
      setError(`File must be smaller than ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`);
      return;
    }
    onChange(file.name);
  };

  return (
    <View style={{ gap: spacing.xs }}>
      <Text variant="label" color={colors.onSurfaceVariant}>
        {label}
      </Text>
      {fileName ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.md,
            borderRadius: radii.lg,
            backgroundColor: colors.surfaceContainerLow,
          }}
        >
          <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>
            {fileName}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Remove file"
            onPress={() => onChange(undefined)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.destructive} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          onPress={pick}
          style={{
            alignItems: 'center',
            gap: spacing.xs,
            padding: spacing.lg,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.outlineVariant,
          }}
        >
          <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
          <Text variant="small">Tap to upload</Text>
          <Text variant="label" color={colors.mutedForeground}>
            {hint}
          </Text>
        </TouchableOpacity>
      )}
      {error ? (
        <Text variant="label" color={colors.destructive}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
