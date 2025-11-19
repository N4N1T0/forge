import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { InferRequestType } from 'hono'

// TYPES
type RequestType = InferRequestType<(typeof client.api.login.current)['$get']>

// HOOK
export const useCurrent = () => {
  const query = useQuery<RequestType>({
    queryKey: ['current'],
    queryFn: async () => {
      const response = await client.api.login.current.$get()

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      if (!data.success) {
        return null
      }

      return data
    }
  })

  return query
}
