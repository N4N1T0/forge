/**
 * Task completion statistics
 */
export interface TaskStats {
  completed: number
  total: number
  completionRate: number
}

/**
 * Project summary with completion information
 */
export interface ProjectSummary {
  id: string
  name: string
  completionRate: number
  status: 'active' | 'completed' | 'on-hold'
  taskCount: number
  completedTasks: number
}

/**
 * Member summary with role and activity information
 */
export interface MemberSummary {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  avatar?: string
  lastActive?: string | undefined
}

/**
 * Quick statistics for workspace overview
 */
export interface QuickStats {
  totalProjects: number
  totalTasks: number
  totalMembers: number
  recentActivity: number
}

/**
 * Complete dashboard data structure
 */
export interface DashboardData {
  taskStats: TaskStats
  projects: ProjectSummary[]
  members: MemberSummary[]
  quickStats: QuickStats
}

/**
 * Props for dashboard error boundary
 */
export interface DashboardErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Props for individual dashboard cards
 */
export interface DashboardCardProps {
  workspaceId: string
}
