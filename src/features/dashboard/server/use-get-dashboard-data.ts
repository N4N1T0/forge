import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

// TYPES
interface UseGetDashboardDataProps {
  workspaceId: string
}

// HOOKS
export const useGetDashboardData = ({
  workspaceId
}: UseGetDashboardDataProps) => {
  const query = useQuery({
    queryKey: ['dashboard', workspaceId],
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      try {
        const response = await client.api.dashboard[
          ':workspaceId'
        ].dashboard.$get({
          param: {
            workspaceId
          }
        })

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Access denied to workspace dashboard')
          } else if (response.status === 404) {
            throw new Error('Workspace not found')
          } else if (response.status >= 500) {
            throw new Error('Server error - please try again later')
          } else {
            throw new Error(`Request failed with status ${response.status}`)
          }
        }

        const data = await response.json()

        if (!data.success) {
          const errorMessage =
            typeof data.data === 'string'
              ? data.data
              : 'Failed to fetch dashboard data'
          throw new Error(errorMessage)
        }

        return data.data
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error(
            'Network connection failed - please check your internet connection'
          )
        }

        throw error
      }
    }
  })

  return query
}
