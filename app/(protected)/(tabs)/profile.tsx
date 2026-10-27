import React, { useState } from 'react';
import { View } from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { store } from '@/store';
import { placementApi } from '@/store/api/placementApi';
import { useTheme } from '@/theme/ThemeProvider';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [error, setError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setError('');
    setIsSigningOut(true);
    try {
      store.dispatch(placementApi.util.resetApiState());
      await signOut();
    } catch {
      setError('Unable to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Screen padded>
      <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing.md }}>
        <Text variant="h2">Profile</Text>
        <Text variant="body">{user?.fullName ?? user?.primaryEmailAddress?.emailAddress}</Text>
        {error ? <ErrorState message={error} /> : null}
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
