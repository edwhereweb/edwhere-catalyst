import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClerk } from '@clerk/clerk-expo';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { store } from '@/store';
import { gamificationApi, useGetProfileQuery } from '@/store/api/gamificationApi';
import { placementApi } from '@/store/api/placementApi';
import { studyApi } from '@/store/api/studyApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatNumber } from '@/utils/format';

function StatPill({ icon, value, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; value: string; label: string }) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm + 2,
        borderRadius: radii.full,
        backgroundColor: colors.heroForeground + '1f',
      }}
    >
      <Ionicons name={icon} size={18} color={colors.highlight} />
      <View>
        <Text variant="button" color={colors.heroForeground}>
          {value}
        </Text>
        <Text variant="label" color={colors.heroMuted} style={{ letterSpacing: 0 }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { signOut } = useClerk();
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [error, setError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setError('');
    setIsSigningOut(true);
    try {
      store.dispatch(placementApi.util.resetApiState());
      store.dispatch(gamificationApi.util.resetApiState());
      store.dispatch(studyApi.util.resetApiState());
      await signOut();
    } catch {
      setError('Unable to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Screen scroll padded>
      <ScreenHeader title="Profile" />
      <QueryState
        isLoading={isLoading}
        isError={isError || !profile}
        onRetry={refetch}
        errorMessage="Could not load your profile."
      >
        {profile ? (
          <View style={{ gap: spacing.md }}>
            <Card tone="hero" style={{ alignItems: 'center', gap: spacing.md }}>
              <Avatar name={profile.name} size={96} highlighted />
              <View style={{ alignItems: 'center', gap: spacing.xs }}>
                <Text variant="h2" color={colors.heroForeground} style={{ textAlign: 'center' }}>
                  {profile.name}
                </Text>
                {profile.headline ? (
                  <Text variant="small" color={colors.heroMuted} style={{ textAlign: 'center' }}>
                    {profile.headline}
                  </Text>
                ) : null}
              </View>
              <View style={{ flexDirection: 'row', gap: spacing.sm, alignSelf: 'stretch' }}>
                <StatPill icon="star" value={formatNumber(profile.points)} label="Points" />
                <StatPill icon="flame" value={`${profile.streak} days`} label="Streak" />
              </View>
              <Button
                label="Edit Profile"
                icon="create-outline"
                variant="highlight"
                onPress={() => router.push('/(protected)/edit-profile' as any)}
              />
            </Card>

            {profile.badges.length ? (
              <Card style={{ gap: spacing.md }}>
                <Text variant="h4">Experience Badges</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {profile.badges.map((badge) => (
                    <Badge key={badge} label={badge} variant="secondary" uppercase={false} />
                  ))}
                </View>
              </Card>
            ) : null}

            <Card style={{ gap: spacing.md }}>
              <Text variant="h4">Skills</Text>
              {profile.skills.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {profile.skills.map((skill) => (
                    <Badge key={skill} label={skill} variant="info" uppercase={false} />
                  ))}
                </View>
              ) : (
                <Text variant="small" color={colors.mutedForeground}>
                  Add your skills from Edit Profile.
                </Text>
              )}
            </Card>

            <Card style={{ gap: spacing.md }}>
              <Text variant="h4">Resume</Text>
              {profile.resumeUrl ? (
                <Button
                  label="Open resume"
                  icon="open-outline"
                  variant="tonal"
                  onPress={() => void Linking.openURL(profile.resumeUrl as string)}
                />
              ) : (
                <>
                  <Text variant="small" color={colors.mutedForeground}>
                    Add a Google Drive link so recruiters can see your resume.
                  </Text>
                  <Button
                    label="Add resume link"
                    variant="tonal"
                    icon="link-outline"
                    onPress={() => router.push('/(protected)/edit-profile' as any)}
                  />
                </>
              )}
            </Card>

            {profile.certifications.length ? (
              <Card style={{ gap: spacing.md }}>
                <Text variant="h4">Certifications</Text>
                {profile.certifications.map((cert) => (
                  <View
                    key={cert.credentialId}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
                  >
                    <IconTile icon="ribbon-outline" tone="amber" />
                    <View style={{ flex: 1 }}>
                      <Text variant="body">{cert.name}</Text>
                      <Text variant="label" color={colors.mutedForeground}>
                        Credential ID: {cert.credentialId}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card>
            ) : null}
          </View>
        ) : null}
      </QueryState>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {error ? (
          <Text variant="label" color={colors.destructive}>
            {error}
          </Text>
        ) : null}
        <Button
          label="Sign out"
          loading={isSigningOut}
          onPress={handleSignOut}
          variant="outline"
          icon="log-out-outline"
        />
      </View>
    </Screen>
  );
}
