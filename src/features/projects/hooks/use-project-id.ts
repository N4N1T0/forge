'use client'

import { useGetProject } from '@/features/projects/server/use-get-project'
import { useParams, usePathname } from 'next/navigation'

/**
 * Hook to get the current project ID from URL parameters
 * @returns {string} The project ID from the URL parameters
 */
export const useProjectId = (): string => {
  const params = useParams()
  return params.projectId as string
}

/**
 * Hook to get both workspace ID and project ID from URL parameters
 * @returns {Object} Object containing workspace and project IDs
 * @returns {string} workspaceId - The workspace ID from the URL parameters
 * @returns {string} projectId - The project ID from the URL parameters
 */
export const useProjectParams = (): {
  workspaceId: string
  projectId: string
} => {
  const params = useParams()

  return {
    workspaceId: params.workspaceId as string,
    projectId: params.projectId as string
  }
}

/**
 * Hook to fetch the current project data based on the URL path and project ID.
 * The query is enabled only when on a valid project path and a project ID is present.
 * @returns The result of the project query, including data, loading, and error states.
 */
export const useGetCurrentProject = () => {
  const pathname = usePathname()
  const projectId = useProjectId()

  const segments = pathname.split('/').filter(Boolean)
  const isProjectPath = pathname.includes('/projects/')
  const enabled = isProjectPath && segments.length > 4 && !!projectId

  const { data: project, isLoading } = useGetProject({ projectId, enabled })
  return { project, isLoading }
}
