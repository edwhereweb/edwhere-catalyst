import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { QueryState } from '@/components/feedback/QueryState';
import { STATE_BADGE } from '@/components/projects/stageState';
import { useGetProjectQuery } from '@/store/api/projectsApi';
import { useTheme } from '@/theme/ThemeProvider';

export default function ProjectDetailScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const router = useRouter();
  const { data: project, isLoading, isError, refetch } = useGetProjectQuery(projectId);

  return (
    <Screen scroll padded>
      <ScreenHeader title="Project" showBack />
      <QueryState
        isLoading={isLoading}
        isError={isError || !project}
        onRetry={refetch}
        errorMessage="Could not load this project."
      >
        {project ? (
          <View style={{ gap: spacing.md }}>
            <Text variant="h2">{project.title}</Text>
            <Text variant="body" color={colors.mutedForeground}>
              {project.description}
            </Text>
            <Card style={{ gap: spacing.sm }}>
              <ProgressBar
                value={project.stages.length ? (project.approvedCount / project.stages.length) * 100 : 0}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="small">
                  {project.approvedCount}/{project.stages.length} stages approved
                </Text>
                <Text variant="small" color={colors.xp}>
                  {project.earnedPoints}/{project.totalPoints} pts
                </Text>
              </View>
            </Card>

            {project.stages.map((stage) => {
              const locked = stage.state === 'locked';
              const badge = STATE_BADGE[stage.state];
              const approved = stage.state === 'approved';
              return (
                <TouchableOpacity
                  key={stage.id}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: locked }}
                  accessibilityLabel={`Stage ${stage.order}, ${stage.title}, ${badge.label}`}
                  disabled={locked}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/(protected)/projects/${project.id}/${stage.id}` as any)}
                >
                  <Card style={{ gap: spacing.xs, opacity: locked ? 0.6 : 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Ionicons
                        name={locked ? 'lock-closed' : approved ? 'checkmark-circle' : 'ellipse-outline'}
                        size={22}
                        color={approved ? colors.success : colors.mutedForeground}
                      />
                      <Text variant="h4" style={{ flex: 1 }} numberOfLines={2}>
                        {stage.order}. {stage.title}
                      </Text>
                      <Badge label={badge.label} variant={badge.variant} />
                    </View>
                    <Text variant="label" color={colors.mutedForeground}>
                      {stage.inputType === 'text' ? 'Written submission' : 'Files / screenshots'} ·{' '}
                      {approved && stage.submission?.score != null
                        ? `${stage.submission.score}/${stage.points} pts`
                        : `${stage.points} pts`}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </QueryState>
    </Screen>
  );
}
