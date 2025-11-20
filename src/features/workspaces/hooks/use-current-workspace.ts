import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await client.api.workspace.$get()
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data.data
    }
  })

  return query
}

export const useCurrentWorkspace = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ['current-workspace', workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const response = await client.api.workspace[':workspaceId'].$get({
        param: {
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
