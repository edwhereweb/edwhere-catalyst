import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { clearLabFilters, defaultLabFilters, setLabFilters } from '@/store/labFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import type { LabDifficulty, LabFilters } from '@/types/gamification';

const DIFFICULTIES: LabDifficulty[] = ['easy', 'medium', 'hard'];
const FIELDS = ['Malware', 'Network', 'Web', 'Cloud', 'Cryptography'];
const JOB_ROLES = ['SOC', 'Auditor', 'Pen-Tester', 'Cloud Security'];
const HOURS_STEPS = [5, 10, 15, 20];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function LabsFilterScreen() {
  const { theme } = useTheme();
  const { spacing } = theme;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const applied = useAppSelector((state) => state.labFilters);
  const [draft, setDraft] = useState<LabFilters>(applied);

  const handleClear = () => {
    setDraft(defaultLabFilters);
    dispatch(clearLabFilters());
  };

  const handleApply = () => {
    dispatch(setLabFilters(draft));
    router.back();
  };

  return (
    <Screen scroll padded>
      <ScreenHeader title="Labs Filter" showBack showNotifications={false} />
      <View style={{ gap: spacing.lg, paddingBottom: spacing.xl }}>
        <View style={{ gap: spacing.sm }}>
          <Text variant="h4">Duration (up to {draft.maxHours} hrs)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {HOURS_STEPS.map((hours) => (
              <Chip
                key={hours}
                label={`${hours} hrs`}
                selected={draft.maxHours === hours}
                onPress={() => setDraft({ ...draft, maxHours: hours })}
              />
            ))}
          </View>
        </View>
        <View style={{ gap: spacing.sm }}>
          <Text variant="h4">Difficulty</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {DIFFICULTIES.map((difficulty) => (
              <Chip
                key={difficulty}
                label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                selected={draft.difficulties.includes(difficulty)}
                onPress={() =>
                  setDraft({ ...draft, difficulties: toggle(draft.difficulties, difficulty) })
                }
              />
            ))}
          </View>
        </View>
        <View style={{ gap: spacing.sm }}>
          <Text variant="h4">Field</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {FIELDS.map((field) => (
              <Chip
                key={field}
                label={field}
                selected={draft.fields.includes(field)}
                onPress={() => setDraft({ ...draft, fields: toggle(draft.fields, field) })}
              />
            ))}
          </View>
        </View>
        <View style={{ gap: spacing.sm }}>
          <Text variant="h4">Job Role</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {JOB_ROLES.map((role) => (
              <Chip
                key={role}
                label={role}
                selected={draft.jobRoles.includes(role)}
                onPress={() => setDraft({ ...draft, jobRoles: toggle(draft.jobRoles, role) })}
              />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Clear All" variant="outline" onPress={handleClear} style={{ flex: 1 }} />
          <Button label="Apply Filters" onPress={handleApply} style={{ flex: 1 }} />
        </View>
      </View>
    </Screen>
  );
}
