/**
 * React Query keys for dashboard data fetching
 * Provides consistent cache key structure for dashboard queries
 */

export const dashboardKeys = {
  all: ['dashboard'] as const,
  workspace: (workspaceId: string) =>
    [...dashboardKeys.all, workspaceId] as const,
  taskStats: (workspaceId: string) =>
    [...dashboardKeys.workspace(workspaceId), 'tasks'] as const,
  projects: (workspaceId: string) =>
    [...dashboardKeys.workspace(workspaceId), 'projects'] as const,
  members: (workspaceId: string) =>
    [...dashboardKeys.workspace(workspaceId), 'members'] as const,
  quickStats: (workspaceId: string) =>
    [...dashboardKeys.workspace(workspaceId), 'quick-stats'] as const
}
