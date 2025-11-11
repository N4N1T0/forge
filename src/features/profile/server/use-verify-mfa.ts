import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type VerifyResponseType = InferResponseType<
  (typeof client.api.profile.mfa.verify)['$post']
>

interface VerifyMFARequest {
  otp: string
}

// HOOK - VERIFY MFA (Complete Setup)
export const useVerifyMFA = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<VerifyResponseType, Error, VerifyMFARequest>({
    mutationFn: async ({ otp }) => {
      const response = await client.api.profile.mfa.verify.$post({
        json: { otp }
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('MFA enabled successfully', {
        description: 'Two-factor authentication has been activated.'
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      toast.error('Error verifying code', {
        description: error.message || 'The code entered is not valid'
      })
    }
  })

  return mutation
}
