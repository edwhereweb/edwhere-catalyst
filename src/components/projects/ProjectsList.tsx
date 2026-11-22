import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/feedback/EmptyState';
import { QueryState } from '@/components/feedback/QueryState';
import { useGetProjectsQuery } from '@/store/api/projectsApi';
import { useTheme } from '@/theme/ThemeProvider';
import type { ProjectSummary } from '@/types/projects';

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'destructive' } as const;

function ProjectCard({ project, onPress }: { project: ProjectSummary; onPress: () => void }) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const percent = project.stageCount ? (project.approvedCount / project.stageCount) * 100 : 0;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${project.title}, ${project.approvedCount} of ${project.stageCount} stages done`}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Card style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Badge label={project.field} variant="info" uppercase={false} />
          <Badge label={project.difficulty} variant={difficultyVariant[project.difficulty]} />
        </View>
        <Text variant="h4">{project.title}</Text>
        <Text variant="small" color={colors.mutedForeground} numberOfLines={3}>
          {project.description}
        </Text>
        <ProgressBar value={percent} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="label" color={colors.mutedForeground}>
            {project.approvedCount}/{project.stageCount} stages
          </Text>
          <Text variant="label" color={colors.xp}>
            {project.earnedPoints}/{project.totalPoints} pts
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export function ProjectsList() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isLoading, isError, isFetching, refetch } = useGetProjectsQuery();

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      loadingMessage="Loading projects…"
      errorMessage="Could not load projects."
    >
      <FlatList<ProjectSummary>
        data={data}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ gap: theme.spacing.md, paddingBottom: theme.spacing.xl, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState title="No projects yet" message="Your instructor has not published a project." />
        }
        renderItem={({ item }) => (
          <ProjectCard project={item} onPress={() => router.push(`/(protected)/projects/${item.id}` as any)} />
        )}
      />
    </QueryState>
  );
}
