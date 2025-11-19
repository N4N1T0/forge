import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// TYPES
export type ResponseType = InferResponseType<
  (typeof client.api.login)['mfa']['verify']['$post']
>
export type RequestType = InferRequestType<
  (typeof client.api.login)['mfa']['verify']['$post']
>

// HOOK
export const useMfaVerification = () => {
  const router = useRouter()
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.login['mfa']['verify']['$post']({ json })
      const data = await res.json()

      if (!data.success) {
        throw new Error(
          typeof data.data === 'string' ? data.data : 'Invalid MFA code'
        )
      }

      return { success: true }
    },
    onSuccess: () => {
      toast.success('MFA verification completed')
      router.refresh()
    },
    onError: (error) => {
      const message = error.message || 'Error verifying MFA'
      toast.error(message)
    }
  })
}
