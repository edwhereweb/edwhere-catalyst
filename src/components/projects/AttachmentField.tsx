import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import {
  PROJECT_FILE_MAX_BYTES,
  PROJECT_FILE_TYPES,
  uploadProjectFile,
} from '@/services/projectUpload';
import { useTheme } from '@/theme/ThemeProvider';
import type { ProjectAttachment } from '@/types/projects';

interface Props {
  projectId: string;
  stageId: string;
  value: ProjectAttachment[];
  onChange: (next: ProjectAttachment[]) => void;
  /** Round to tag new files with, so the reviewer can tell what was added after feedback. */
  revision: number;
  cap: number;
  disabled?: boolean;
}

const stripExtension = (name: string) => name.replace(/\.[^.]+$/, '').slice(0, 80);

/** Same dashed upload box as FilePicker, plus a name and description for every file. */
export function AttachmentField({ projectId, stageId, value, onChange, revision, cap, disabled }: Props) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const room = cap - value.length;

  const pick = async () => {
    setError('');
    const result = await DocumentPicker.getDocumentAsync({
      type: PROJECT_FILE_TYPES,
      copyToCacheDirectory: true,
      multiple: room > 1,
    });
    if (result.canceled) return;
    const files = result.assets.slice(0, room);
    setUploading(true);
    const added: ProjectAttachment[] = [];
    for (const file of files) {
      if (file.size && file.size > PROJECT_FILE_MAX_BYTES) {
        setError(`${file.name} is larger than 5 MB.`);
        continue;
      }
      try {
        const url = await uploadProjectFile(
          { uri: file.uri, name: file.name, mimeType: file.mimeType },
          projectId,
          stageId,
        );
        added.push({ url, name: stripExtension(file.name), description: '', round: revision });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed.');
      }
    }
    if (added.length) onChange([...value, ...added]);
    setUploading(false);
  };

  const update = (url: string, patch: Partial<ProjectAttachment>) =>
    onChange(value.map((a) => (a.url === url ? { ...a, ...patch } : a)));

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="label" color={colors.onSurfaceVariant}>
          Files ({value.length}/{cap})
        </Text>
        <Text variant="label" color={colors.mutedForeground}>
          PNG, JPG, WebP or PDF · 5 MB each
        </Text>
      </View>

      {value.map((a) => (
        <View
          key={a.url}
          style={{
            gap: spacing.sm,
            padding: spacing.md,
            borderRadius: radii.lg,
            backgroundColor: colors.surfaceContainerLow,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>
              {a.name || 'Untitled file'}
            </Text>
            {a.round > 1 ? <Badge label="Added after feedback" variant="info" uppercase={false} /> : null}
            {disabled ? null : (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Remove ${a.name}`}
                onPress={() => onChange(value.filter((x) => x.url !== a.url))}
              >
                <Ionicons name="trash-outline" size={20} color={colors.destructive} />
              </TouchableOpacity>
            )}
          </View>
          <Input
            label="Name"
            value={a.name}
            maxLength={80}
            editable={!disabled}
            placeholder="e.g. Login page wireframe"
            onChangeText={(name) => update(a.url, { name })}
          />
          <Input
            label="Description (optional)"
            value={a.description}
            maxLength={300}
            editable={!disabled}
            multiline
            placeholder="What does this show or what did you change?"
            style={{ minHeight: 64, textAlignVertical: 'top', paddingTop: spacing.sm }}
            onChangeText={(description) => update(a.url, { description })}
          />
        </View>
      ))}

      {disabled || room <= 0 ? null : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Add file"
          disabled={uploading}
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
            opacity: uploading ? 0.6 : 1,
          }}
        >
          <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
          <Text variant="small">{uploading ? 'Uploading…' : 'Add file'}</Text>
          <Text variant="label" color={colors.mutedForeground}>
            Tap to upload · {room} more allowed
          </Text>
        </TouchableOpacity>
      )}
      {error ? (
        <Text variant="label" color={colors.destructive} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
