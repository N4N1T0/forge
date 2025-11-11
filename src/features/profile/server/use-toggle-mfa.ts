import { ProfileData } from '@/features/profile/types'
import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type EnableResponseType = InferResponseType<
  (typeof client.api.profile.mfa.enable)['$post']
>
type DisableResponseType = InferResponseType<
  (typeof client.api.profile.mfa.disable)['$post']
>

// HOOK - ENABLE MFA (Get QR Code)
export const useEnableMFA = () => {
  const mutation = useMutation<EnableResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.profile.mfa.enable.$post()
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onError: (error) => {
      toast.error('Error generating QR code', {
        description: error.message || 'Could not start MFA setup'
      })
    }
  })

  return mutation
}

// HOOK - DISABLE MFA
export const useDisableMFA = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    DisableResponseType,
    Error,
    void,
    { previousProfile: ProfileData | undefined }
  >({
    mutationFn: async () => {
      const response = await client.api.profile.mfa.disable.$post()
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['profile'] })
      const previousProfile = queryClient.getQueryData<ProfileData>(['profile'])

      queryClient.setQueryData<ProfileData>(['profile'], (old) => {
        if (!old) return old
        return { ...old, mfaEnabled: false }
      })

      return { previousProfile }
    },
    onSuccess: () => {
      toast.success('MFA disabled successfully', {
        description: 'Two-factor authentication has been deactivated.'
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile)
      }

      toast.error('Error disabling MFA', {
        description: error.message || 'Could not disable MFA'
      })
    }
  })

  return mutation
}
