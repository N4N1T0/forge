import { useParams } from 'next/navigation'

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
