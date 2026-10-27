import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useClerk } from '@clerk/clerk-expo';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { store } from '@/store';
import { gamificationApi, useGetProfileQuery } from '@/store/api/gamificationApi';
import { placementApi } from '@/store/api/placementApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatNumber } from '@/utils/format';

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
          <View style={{ gap: spacing.md, paddingBottom: spacing.md }}>
            <View style={{ alignItems: 'center', gap: spacing.xs }}>
              <Avatar name={profile.name} size={88} highlighted />
              <Text variant="h3">{profile.name}</Text>
              <Text variant="small" color={colors.mutedForeground}>
                {profile.headline}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <Text variant="h3" color={colors.xp}>
                  {formatNumber(profile.points)}
                </Text>
                <Text variant="label" color={colors.mutedForeground}>
                  Points
                </Text>
              </Card>
              <Card style={{ flex: 1, alignItems: 'center' }}>
                <Text variant="h3" color={colors.streak}>
                  {profile.streak} Days
                </Text>
                <Text variant="label" color={colors.mutedForeground}>
                  Streak
                </Text>
              </Card>
            </View>
            <Button
              label="Edit Profile"
              variant="outline"
              fullWidth
              onPress={() => router.push('/(protected)/edit-profile' as any)}
            />
            {profile.badges.length ? (
              <Card style={{ gap: spacing.sm }}>
                <Text variant="h4">Experience Badges</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {profile.badges.map((badge) => (
                    <Badge key={badge} label={badge} variant="secondary" />
                  ))}
                </View>
              </Card>
            ) : null}
            <Card style={{ gap: spacing.sm }}>
              <Text variant="h4">Skills</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {profile.skills.map((skill) => (
                  <Badge key={skill} label={skill} variant="info" />
                ))}
              </View>
            </Card>
            {profile.certifications.length ? (
              <Card style={{ gap: spacing.sm }}>
                <Text variant="h4">Certifications</Text>
                {profile.certifications.map((cert) => (
                  <View key={cert.credentialId}>
                    <Text variant="body">{cert.name}</Text>
                    <Text variant="label" color={colors.mutedForeground}>
                      Credential ID: {cert.credentialId}
                    </Text>
                  </View>
                ))}
              </Card>
            ) : null}
          </View>
        ) : null}
      </QueryState>
      <View style={{ gap: spacing.sm, paddingBottom: spacing.xl }}>
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
          fullWidth
        />
      </View>
    </Screen>
  );
}
