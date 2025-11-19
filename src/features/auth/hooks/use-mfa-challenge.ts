import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import type { InferResponseType } from 'hono/client'

// TYPES
export type ResponseType = InferResponseType<
  typeof client.api.login.mfa.challenge.$get
>

// HOOK
export const useMfaChallenge = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['mfa-challenge'],
    queryFn: async () => {
      const response = await client.api.login.mfa.challenge.$get()

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return { success: true, data: data.data, expires: data.expires }
    }
  })

  return query
}
