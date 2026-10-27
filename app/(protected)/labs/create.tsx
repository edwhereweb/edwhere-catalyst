import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { FilePicker } from '@/components/ui/FilePicker';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { useCreateLabMutation } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import type { CreateLabInput } from '@/types/gamification';

const FIELDS = ['Web Security', 'Network Auditing', 'Digital Forensics', 'Cryptography', 'Malware Analysis'];
const LEVELS: { value: CreateLabInput['difficulty']; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];
const TEN_MB = 10 * 1024 * 1024;

export default function CreateLabScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const [createLab, { isLoading, isError }] = useCreateLabMutation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [field, setField] = useState('');
  const [hours, setHours] = useState('');
  const [difficulty, setDifficulty] = useState<CreateLabInput['difficulty']>('beginner');
  const [fileName, setFileName] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  const parsedHours = Number(hours);
  const errors = {
    name: name.trim() ? '' : 'Lab name is required.',
    description: description.trim() ? '' : 'Description is required.',
    field: field ? '' : 'Select a field.',
    hours: parsedHours > 0 ? '' : 'Enter the estimated hours.',
  };
  const isValid = !Object.values(errors).some(Boolean);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!isValid) return;
    const result = await createLab({
      name: name.trim(),
      description: description.trim(),
      field,
      hours: parsedHours,
      difficulty,
      instructionsFileName: fileName,
    });
    if ('data' in result) router.back();
  };

  return (
    <Screen scroll padded>
      <ScreenHeader
        title="Create New Lab"
        subtitle="Your lab will be reviewed before it is published."
        showBack
      />
      <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
        <Input
          label="Lab Name"
          value={name}
          onChangeText={setName}
          error={submitted ? errors.name : undefined}
        />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.sm }}
          error={submitted ? errors.description : undefined}
        />
        <View style={{ gap: spacing.sm }}>
          <Text variant="label" color={colors.onSurfaceVariant}>
            Field
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {FIELDS.map((item) => (
              <Chip key={item} label={item} selected={field === item} onPress={() => setField(item)} />
            ))}
          </View>
          {submitted && errors.field ? (
            <Text variant="label" color={colors.destructive}>
              {errors.field}
            </Text>
          ) : null}
        </View>
        <Input
          label="Estimated Hours"
          value={hours}
          onChangeText={setHours}
          keyboardType="decimal-pad"
          error={submitted ? errors.hours : undefined}
        />
        <View style={{ gap: spacing.sm }}>
          <Text variant="label" color={colors.onSurfaceVariant}>
            Difficulty Level
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {LEVELS.map((level) => (
              <Chip
                key={level.value}
                label={level.label}
                selected={difficulty === level.value}
                onPress={() => setDifficulty(level.value)}
              />
            ))}
          </View>
        </View>
        <FilePicker
          label="Instructions Upload (PDF/MD)"
          hint="Max size: 10MB"
          types={['application/pdf', 'text/markdown']}
          maxSizeBytes={TEN_MB}
          fileName={fileName}
          onChange={setFileName}
        />
        {isError ? (
          <Text variant="label" color={colors.destructive}>
            Could not submit your lab. Please try again.
          </Text>
        ) : null}
        <Button label="Submit for Review" loading={isLoading} onPress={handleSubmit} fullWidth />
        <Card style={{ backgroundColor: colors.infoLight }}>
          <Text variant="small" color={colors.info}>
            Authors gain +50 XP and a &quot;Creator&quot; badge upon first approved lab publication.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
