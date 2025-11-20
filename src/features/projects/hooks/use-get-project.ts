import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

interface UseGetProjectProps {
  projectId: string
  enabled?: boolean
}

export const useGetProject = ({
  projectId,
  enabled = true
}: UseGetProjectProps) => {
  const query = useQuery({
    queryKey: ['project', projectId],
    enabled: enabled && !!projectId,
    queryFn: async () => {
      const response = await client.api.project[':projectId'].$get({
        param: { projectId }
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
