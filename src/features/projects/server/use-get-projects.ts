import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

export const useGetProjects = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ['projects', workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.project.$get({
        query: {
          workspaceId
        }
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })

  return query
}
