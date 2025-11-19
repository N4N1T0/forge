import { ProfileData } from '@/features/profile/types'
import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<(typeof client.api.profile)['$patch']>
type RequestType = InferRequestType<(typeof client.api.profile)['$patch']>

// HOOK
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType,
    { previousProfile: ProfileData | undefined }
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.profile.$patch({ json })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onMutate: async ({ json }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile'] })

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<ProfileData>(['profile'])

      // Optimistically update profile
      queryClient.setQueryData<ProfileData>(['profile'], (old) => {
        if (!old) return old
        return {
          ...old,
          name: json.name,
          bio: json.bio
        }
      })

      return { previousProfile }
    },
    onSuccess: () => {
      toast.success('Profile updated successfully', {
        description: 'Your profile information has been updated.'
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile)
      }

      const errorMessage = error.message || 'Error updating profile'
      toast.error('Error updating profile', {
        description: errorMessage
      })
    }
  })

  return mutation
}
