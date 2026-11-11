import React, { useCallback, useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

WebBrowser.maybeCompleteAuthSession();

function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Screen scroll padded>
        <View style={{ alignItems: 'center', gap: theme.spacing.md, paddingTop: theme.spacing['2xl'] }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: theme.radii['2xl'],
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.colors.outlineVariant,
              ...theme.shadows.card,
            }}
          >
            <Image
              accessibilityLabel="Edwhere logo"
              source={require('../../assets/logo.png')}
              style={{ width: 72, height: 72 }}
              resizeMode="contain"
            />
          </View>
          <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
            <Text variant="h1" accessibilityRole="header" style={{ textAlign: 'center' }}>
              Edwhere <Text variant="h1" color={theme.colors.primary}>Catalyst</Text>
            </Text>
            <Text variant="body" color={theme.colors.mutedForeground} style={{ textAlign: 'center' }}>
              Sign in with your Edwhere account to continue.
            </Text>
          </View>
        </View>

        <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
          <Button
            disabled={!isLoaded || isBusy}
            label="Continue with Google"
            icon="logo-google"
            loading={isGoogleSubmitting}
            onPress={handleGoogleSignIn}
            variant="outline"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.outlineVariant }} />
            <Text variant="small" color={theme.colors.mutedForeground}>
              or sign in with email
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.outlineVariant }} />
          </View>

          <Input
            label="Email address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isBusy}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
          />
          <Input
            label="Password"
            autoCapitalize="none"
            autoComplete="password"
            editable={!isBusy}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            value={password}
          />
          {error ? (
            <Text variant="small" color={theme.colors.destructive} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}
          <Button
            disabled={!isLoaded || !email.trim() || !password || isBusy}
            label="Sign in"
            loading={isSubmitting}
            onPress={handleSignIn}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
