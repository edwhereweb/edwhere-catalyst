import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

WebBrowser.maybeCompleteAuthSession();

function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export default function SignInScreen() {
  useWarmUpBrowser();

  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    if (!setActive) return;

    setError('');
    setIsGoogleSubmitting(true);
    try {
      const redirectUrl = Linking.createURL('/(protected)/(tabs)', { scheme: 'edwhere' });
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({
        redirectUrl,
      });

      if (createdSessionId) {
        const activeSetter = setOAuthActive ?? setActive;
        await activeSetter({ session: createdSessionId });
      }
    } catch (googleError) {
      setError(
        googleError instanceof Error
          ? googleError.message
          : 'Google sign-in could not be completed. Please try again.',
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  }, [setActive, startOAuthFlow]);

  const handleSignIn = async () => {
    if (!isLoaded) return;

    setError('');
    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status !== 'complete' || !result.createdSessionId) {
        setError('Sign-in could not be completed. Check your account setup and try again.');
        return;
      }

      await setActive({ session: result.createdSessionId });
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Unable to sign in. Please check your details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isGoogleSubmitting;

  return (
    <Screen padded>
      <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing.md }}>
        <Text variant="h1">Welcome back</Text>
        <Text variant="body" color={theme.colors.mutedForeground}>
          Sign in with your Edwhere account to continue.
        </Text>

        <Button
          disabled={!isLoaded || isBusy}
          label="Continue with Google"
          loading={isGoogleSubmitting}
          onPress={handleGoogleSignIn}
          variant="secondary"
          fullWidth
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: theme.spacing.xs,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: theme.colors.border,
            }}
          />
          <Text
            variant="small"
            color={theme.colors.mutedForeground}
            style={{ marginHorizontal: theme.spacing.sm }}
          >
            or sign in with email
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: theme.colors.border,
            }}
          />
        </View>

        <TextInput
          accessibilityLabel="Email address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isBusy}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor={theme.colors.mutedForeground}
          style={{
            borderColor: theme.colors.border,
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            color: theme.colors.foreground,
            padding: theme.spacing.md,
          }}
          value={email}
        />
        <TextInput
          accessibilityLabel="Password"
          autoCapitalize="none"
          autoComplete="password"
          editable={!isBusy}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={theme.colors.mutedForeground}
          secureTextEntry
          style={{
            borderColor: theme.colors.border,
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            color: theme.colors.foreground,
            padding: theme.spacing.md,
          }}
          value={password}
        />
        {error ? (
          <Text variant="small" color={theme.colors.destructive}>
            {error}
          </Text>
        ) : null}
        <Button
          disabled={!isLoaded || !email.trim() || !password || isBusy}
          label="Sign in"
          loading={isSubmitting}
          onPress={handleSignIn}
          fullWidth
        />
      </View>
    </Screen>
  );
}
