import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import type { UserProfile } from '@/types/gamification';

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving, isError: saveFailed }] = useUpdateProfileMutation();
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [roles, setRoles] = useState('');
  const [skills, setSkills] = useState('');
  const [workPreference, setWorkPreference] = useState<UserProfile['workPreference']>('remote');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setHeadline(profile.headline);
    setBio(profile.bio);
    setRoles(profile.targetRoles.join(', '));
    setSkills(profile.skills.join(', '));
    setWorkPreference(profile.workPreference);
    setResumeUrl(profile.resumeUrl ?? '');
  }, [profile]);

  const resumeInvalid = resumeUrl.trim() !== '' && !isHttpsUrl(resumeUrl.trim());

  const handleSave = async () => {
    setSubmitted(true);
    if (!name.trim() || resumeInvalid) return;
    const result = await updateProfile({
      name: name.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      targetRoles: splitList(roles),
      skills: splitList(skills),
      workPreference,
      resumeUrl: resumeUrl.trim(),
    });
    if ('data' in result) router.back();
  };

  return (
    <Screen scroll padded>
      <ScreenHeader
        title="Edit Profile"
        subtitle="Personalize your professional identity"
        showBack
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        errorMessage="Could not load your profile."
      >
        <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={submitted && !name.trim() ? 'Name is required.' : undefined}
          />
          <Input
            label="Headline"
            value={headline}
            onChangeText={setHeadline}
            placeholder="e.g. Aspiring SOC Analyst"
            maxLength={120}
          />
          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.sm }}
          />
          <Input label="Target Roles (comma separated)" value={roles} onChangeText={setRoles} />
          <Input label="Core Skills (comma separated)" value={skills} onChangeText={setSkills} />
          <View style={{ gap: spacing.sm }}>
            <Text variant="label" color={colors.onSurfaceVariant}>
              Work Preference
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Chip
                label="Remote"
                selected={workPreference === 'remote'}
                onPress={() => setWorkPreference('remote')}
              />
              <Chip
                label="Hybrid"
                selected={workPreference === 'hybrid'}
                onPress={() => setWorkPreference('hybrid')}
              />
            </View>
          </View>
          <Input
            label="Resume link"
            value={resumeUrl}
            onChangeText={setResumeUrl}
            placeholder="https://drive.google.com/…"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            error={submitted && resumeInvalid ? 'Enter a valid https link.' : undefined}
          />
          <Text variant="label" color={colors.mutedForeground} style={{ marginTop: -spacing.sm }}>
            Upload your resume to Google Drive, set sharing to "Anyone with the link can view", then
            paste the link here.
          </Text>
          {saveFailed ? (
            <Text variant="label" color={colors.destructive}>
              Could not save your changes. Please try again.
            </Text>
          ) : null}
          <Button label="Save Changes" loading={isSaving} onPress={handleSave} fullWidth />
          <Button label="Cancel" variant="ghost" onPress={router.back} fullWidth />
        </View>
      </QueryState>
    </Screen>
  );
}
