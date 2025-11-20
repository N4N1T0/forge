'use client'

import { useCurrentWorkspace } from '@/features/workspaces/hooks/use-current-workspace'
import { Workspaces } from '@/types/appwrite'
import { useParams } from 'next/navigation'

/**
 * Hook to get the current workspace ID from URL parameters
 * @returns {string} The workspace ID from the URL parameters
 */
export const useWorkspaceId = (): string => {
  const params = useParams()
  return params.workspaceId as string
}

/**
 * Hook to fetch and return the current workspace data
 * @returns {Object} Object containing workspace data and loading state
 * @returns {Object} workspace - The current workspace data
 * @returns {boolean} isLoading - Loading state of the workspace data fetch
 */
export const useGetCurrentWorkspace = (): {
  workspace: Partial<Workspaces> | undefined
  isLoading: boolean
} => {
  const workspaceId = useWorkspaceId()
  const { data: workspace, isLoading } = useCurrentWorkspace(workspaceId)

  return {
    workspace,
    isLoading
  }
}
