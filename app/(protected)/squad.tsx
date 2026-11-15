import React, { useState } from 'react';
import { Alert, Platform, Share, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import {
  useCreateSquadMutation,
  useGetSquadQuery,
  useJoinSquadMutation,
  useLeaveSquadMutation,
  useNudgeSquadMutation,
} from '@/store/api/gamificationApi';
import { useTheme } from '@/theme/ThemeProvider';
import { formatNumber } from '@/utils/format';

const serverMessage = (error: unknown) =>
  (error as { data?: { error?: { message?: string } } } | undefined)?.data?.error?.message;

function JoinOrCreate() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [createSquad, create] = useCreateSquadMutation();
  const [joinSquad, join] = useJoinSquadMutation();

  return (
    <View style={{ gap: spacing.md }}>
      <Text variant="body" color={colors.mutedForeground}>
        Study with up to 5 friends. Everyone shares one streak, so you keep each other going.
      </Text>

      <Card style={{ gap: spacing.md }}>
        <Text variant="h4">Join a squad</Text>
        <Input
          label="Squad code"
          value={code}
          onChangeText={(text) => setCode(text.toUpperCase())}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          placeholder="6-character code"
        />
        {join.isError ? (
          <Text variant="label" color={colors.destructive} accessibilityRole="alert">
            {serverMessage(join.error) ?? 'Could not join. Check the code and try again.'}
          </Text>
        ) : null}
        <Button
          label="Join squad"
          icon="people-outline"
          loading={join.isLoading}
          disabled={code.trim().length !== 6}
          onPress={() => joinSquad({ code: code.trim() })}
        />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <Text variant="h4">Start your own</Text>
        <Input label="Squad name" value={name} onChangeText={setName} maxLength={40} placeholder="e.g. Cyber Crew" />
        {create.isError ? (
          <Text variant="label" color={colors.destructive} accessibilityRole="alert">
            {serverMessage(create.error) ?? 'Could not create the squad. Please try again.'}
          </Text>
        ) : null}
        <Button
          label="Create squad"
          variant="outline"
          icon="add-circle-outline"
          loading={create.isLoading}
          disabled={name.trim().length < 2}
          onPress={() => createSquad({ name: name.trim() })}
        />
      </Card>
    </View>
  );
}

export default function SquadScreen() {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { data: squad, isLoading, isError, refetch } = useGetSquadQuery();
  const [leaveSquad, leave] = useLeaveSquadMutation();
  const [nudgeSquad, nudge] = useNudgeSquadMutation();
  const [nudgeNote, setNudgeNote] = useState('');

  const share = () =>
    Share.share({
      message: `Join my squad "${squad?.name}" on Edwhere Catalyst. Use code ${squad?.code} and let's get placement-ready together.`,
    });

  const confirmLeave = () => {
    if (Platform.OS === 'web') {
      void leaveSquad();
      return;
    }
    Alert.alert('Leave this squad?', 'You will lose the shared streak with these friends.', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: () => void leaveSquad() },
    ]);
  };

  const sendNudge = async () => {
    setNudgeNote('');
    const result = await nudgeSquad();
    if (result.data) {
      setNudgeNote(result.data.nudged ? `Reminder sent to ${result.data.nudged}.` : 'Everyone is already active today.');
    } else {
      setNudgeNote(serverMessage(result.error) ?? 'Could not send the reminder.');
    }
  };

  return (
    <Screen scroll padded>
      <ScreenHeader title="My Squad" showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        errorMessage="Could not load your squad."
      >
        {!squad ? (
          <JoinOrCreate />
        ) : (
          <View style={{ gap: spacing.md }}>
            <Card tone="hero" style={{ gap: spacing.md }}>
              <Text variant="h3" color={colors.heroForeground}>
                {squad.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: radii.full,
                    backgroundColor: colors.heroForeground + '1f',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="flame" size={34} color={colors.highlight} />
                </View>
                <View>
                  <Text variant="h1" color={colors.heroForeground}>
                    {squad.streak}
                  </Text>
                  <Text variant="label" color={colors.heroMuted}>
                    DAY SQUAD STREAK
                  </Text>
                </View>
              </View>
              <Text variant="small" color={colors.heroMuted}>
                {squad.activeToday} of {squad.members.length} active today. The streak grows on days when at
                least half the squad earns points.
              </Text>
            </Card>

            <Card style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text variant="label" color={colors.mutedForeground}>
                    INVITE CODE
                  </Text>
                  <Text variant="h2" style={{ letterSpacing: 4 }} accessibilityLabel={`Invite code ${squad.code.split('').join(' ')}`}>
                    {squad.code}
                  </Text>
                </View>
                {squad.members.length < squad.maxSize ? (
                  <Button label="Invite" icon="share-outline" size="sm" fullWidth={false} onPress={share} />
                ) : (
                  <Badge label="Squad full" variant="success" />
                )}
              </View>
              <Text variant="label" color={colors.mutedForeground}>
                {squad.members.length} of {squad.maxSize} members
              </Text>
            </Card>

            <Card style={{ gap: spacing.md }}>
              <Text variant="h4">Members</Text>
              {[...squad.members]
                .sort((a, b) => b.weekPoints - a.weekPoints)
                .map((member) => (
                  <View key={member.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <Avatar name={member.name} size={44} highlighted={member.isMe} />
                    <View style={{ flex: 1 }}>
                      <Text variant="body" numberOfLines={1}>
                        {member.name}
                        {member.isMe ? ' (you)' : ''}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: member.activeToday ? colors.success : colors.outlineVariant,
                          }}
                        />
                        <Text variant="label" color={colors.mutedForeground}>
                          {member.activeToday ? 'Active today' : 'Not yet today'}
                          {member.isLeader ? ' · Leader' : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text variant="button" color={colors.primary}>
                        {formatNumber(member.weekPoints)}
                      </Text>
                      <Text variant="label" color={colors.mutedForeground}>
                        this week
                      </Text>
                    </View>
                  </View>
                ))}
            </Card>

            {squad.isLeader ? (
              <View style={{ gap: spacing.sm }}>
                <Button
                  label="Nudge inactive members"
                  icon="notifications-outline"
                  loading={nudge.isLoading}
                  onPress={sendNudge}
                />
                {nudgeNote ? (
                  <Text variant="label" color={colors.mutedForeground} accessibilityRole="alert">
                    {nudgeNote}
                  </Text>
                ) : null}
              </View>
            ) : null}

            <Button
              label="Leave squad"
              variant="outline"
              icon="log-out-outline"
              loading={leave.isLoading}
              onPress={confirmLeave}
            />
          </View>
        )}
      </QueryState>
    </Screen>
  );
}
