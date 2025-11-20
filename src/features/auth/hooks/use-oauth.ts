'use client'

import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono/client'
import { useRouter } from 'next/navigation'
import { OAuthProvider } from 'node-appwrite'
import { toast } from 'sonner'

export type ResponseType = InferResponseType<
  (typeof client.api.login.oauth)[':provider']['$get']
>
export type RequestType = InferRequestType<
  (typeof client.api.login.oauth)[':provider']['$get']
>

export const useOauth = () => {
  const router = useRouter()
  return useMutation<ResponseType, Error, { provider: OAuthProvider }>({
    mutationFn: async ({ provider }) => {
      const res = await client.api.login.oauth[':provider']['$get']({
        param: { provider }
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(
          typeof data.data === 'string' ? data.data : 'OAuth failed'
        )
      }

      return { success: true }
    },
    onSuccess: () => {
      toast.success('Welcome! You have successfully signed in')
      setTimeout(() => {
        router.refresh()
      }, 500)
    },
    onError: (error) => {
      const message = error.message || 'Failed to start OAuth'
      toast.error(message)
    }
  })
}
