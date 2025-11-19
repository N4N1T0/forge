import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

// TYPES
type ResponseType = InferResponseType<
  typeof client.api.login.current.$get
>['data']

// HOOK
export const useCurrent = () => {
  const query = useQuery<ResponseType>({
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

      return data.data
    }
  })

  return query
}
