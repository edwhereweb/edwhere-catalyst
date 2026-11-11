import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetStudyTracksQuery, useRequestStudyPlanMutation } from '@/store/api/studyApi';
import { useTheme } from '@/theme/ThemeProvider';

const PRESETS = [30, 60, 90, 120];
const MIN_DAYS = 7;
const MAX_DAYS = 365;

export default function StartPlanScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data: tracks, isLoading, isError, refetch } = useGetStudyTracksQuery();
  const [requestPlan, { isLoading: starting, isError: startFailed }] = useRequestStudyPlanMutation();
  const [trackId, setTrackId] = useState<string>();
  const [days, setDays] = useState('90');

  const dayCount = Number(days);
  const validDays = Number.isInteger(dayCount) && dayCount >= MIN_DAYS && dayCount <= MAX_DAYS;
  const selected = tracks?.find((t) => t.id === (trackId ?? tracks[0]?.id));

  const onStart = async () => {
    if (!selected || !validDays) return;
    await requestPlan({ trackId: selected.id, days: dayCount }).unwrap();
    router.replace('/(protected)/(tabs)' as any);
  };

  return (
    <Screen scroll padded>
      <ScreenHeader title="Plan your prep" subtitle="Pick a track and how long you have. Your instructor approves it before you start." showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        errorMessage="Could not load study tracks."
      >
        {!tracks?.length ? (
          <EmptyState title="No tracks yet" message="Your instructors have not published a roadmap yet." />
        ) : (
          <View style={{ gap: spacing.lg, paddingBottom: spacing.xl }}>
            <View style={{ gap: spacing.sm }}>
              <Text variant="h4">Career track</Text>
              {tracks.map((track) => (
                <TouchableOpacity
                  key={track.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selected?.id === track.id }}
                  activeOpacity={0.8}
                  onPress={() => setTrackId(track.id)}
                >
                  <Card
                    style={{
                      gap: spacing.xs,
                      borderColor: selected?.id === track.id ? colors.primary : colors.border + '40',
                    }}
                  >
                    <Text variant="h4">{track.title}</Text>
                    <Text variant="small" color={colors.mutedForeground}>
                      {track.description}
                    </Text>
                    <Text variant="label" color={colors.mutedForeground}>
                      {track.topicCount} topics · about {Math.round(track.totalMinutes / 60)} hours
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ gap: spacing.sm }}>
              <Text variant="h4">How many days do you have?</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {PRESETS.map((n) => (
                  <Chip
                    key={n}
                    label={`${n} days`}
                    selected={dayCount === n}
                    onPress={() => setDays(String(n))}
                  />
                ))}
              </View>
              <Input
                label="Or enter your own"
                value={days}
                onChangeText={setDays}
                keyboardType="number-pad"
                error={validDays ? undefined : `Enter ${MIN_DAYS} to ${MAX_DAYS} days`}
              />
              {selected && validDays ? (
                <Text variant="small" color={colors.mutedForeground}>
                  About {Math.max(1, Math.round(selected.totalMinutes / dayCount))} minutes a day.
                </Text>
              ) : null}
            </View>

            {startFailed ? (
              <Text variant="small" color={colors.destructive}>
                Could not send your request. You may already have access to this track.
              </Text>
            ) : null}
            <Button
              label="Request access"
              onPress={onStart}
              loading={starting}
              disabled={!selected || !validDays}
            />
          </View>
        )}
      </QueryState>
    </Screen>
  );
}
