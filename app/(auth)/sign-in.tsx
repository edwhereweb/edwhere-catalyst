import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <Screen padded>
      <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing.md }}>
        <Text variant="h1">Welcome back</Text>
        <Text variant="body" color={theme.colors.mutedForeground}>
          Sign in with your Edwhere account to continue.
        </Text>
        <TextInput
          accessibilityLabel="Email address"
          autoCapitalize="none"
          autoComplete="email"
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
          disabled={!isLoaded || !email.trim() || !password}
          label="Sign in"
          loading={isSubmitting}
          onPress={handleSignIn}
          fullWidth
        />
      </View>
    </Screen>
  );
}
