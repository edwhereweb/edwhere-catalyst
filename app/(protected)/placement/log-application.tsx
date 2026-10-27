import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { PlacementAccessGate } from '@/components/placement/PlacementAccessGate';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { useLogApplicationMutation } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';

const ROLES = ['DevOps', 'SOC Analyst', 'Pen-Tester', 'IT Support'];
const TYPES = ['Full-time', 'Contract', 'Internship', 'Part-time'];
const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LogApplicationScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const [logApplication, { isLoading, isError }] = useLogApplicationMutation();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [appliedDate, setAppliedDate] = useState(today());
  const [status, setStatus] = useState(STATUSES[0]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    jobTitle: jobTitle.trim() ? '' : 'Job title is required.',
    company: company.trim() ? '' : 'Company is required.',
    appliedDate: DATE_PATTERN.test(appliedDate) ? '' : 'Use the format YYYY-MM-DD.',
  };

  const save = async (draft: boolean) => {
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    const result = await logApplication({
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      role,
      type,
      location: location.trim(),
      url: url.trim() || undefined,
      appliedDate,
      status,
      notes: notes.trim() || undefined,
      draft,
    });
    if ('data' in result) router.back();
  };

  const options = (items: string[], value: string, onSelect: (item: string) => void) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {items.map((item) => (
        <Chip key={item} label={item} selected={value === item} onPress={() => onSelect(item)} />
      ))}
    </View>
  );

  return (
    <PlacementAccessGate>
      <Screen scroll padded>
        <ScreenHeader
          title="Log Application"
          subtitle="Every logged application is a step closer to your dream role."
          showBack
        />
        <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
          <Input
            label="Job Title"
            value={jobTitle}
            onChangeText={setJobTitle}
            error={submitted ? errors.jobTitle : undefined}
          />
          <Input
            label="Company"
            value={company}
            onChangeText={setCompany}
            error={submitted ? errors.company : undefined}
          />
          <Text variant="label" color={colors.onSurfaceVariant}>
            Role
          </Text>
          {options(ROLES, role, setRole)}
          <Text variant="label" color={colors.onSurfaceVariant}>
            Type
          </Text>
          {options(TYPES, type, setType)}
          <Input label="Location" value={location} onChangeText={setLocation} />
          <Input
            label="Application URL"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Input
            label="Applied Date (YYYY-MM-DD)"
            value={appliedDate}
            onChangeText={setAppliedDate}
            autoCapitalize="none"
            error={submitted ? errors.appliedDate : undefined}
          />
          <Text variant="label" color={colors.onSurfaceVariant}>
            Status
          </Text>
          {options(STATUSES, status, setStatus)}
          <Input
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.sm }}
          />
          {isError ? (
            <Text variant="label" color={colors.destructive}>
              Could not log your application. Please try again.
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              label="Save Draft"
              variant="outline"
              disabled={isLoading}
              onPress={() => save(true)}
              style={{ flex: 1 }}
            />
            <Button
              label="Log Application"
              loading={isLoading}
              onPress={() => save(false)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Screen>
    </PlacementAccessGate>
  );
}
