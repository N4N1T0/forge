import { ProfileData } from '@/features/profile/types'
import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.profile.workspace)[':workspaceId']['$delete']
>
type RequestType = InferRequestType<
  (typeof client.api.profile.workspace)[':workspaceId']['$delete']
>

// HOOK
export const useLeaveWorkspace = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType,
    { previousProfile: ProfileData | undefined }
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.profile.workspace[':workspaceId'][
        '$delete'
      ]({ param })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onMutate: async ({ param }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile'] })

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<ProfileData>(['profile'])

      // Optimistically remove workspace from list
      queryClient.setQueryData<ProfileData>(['profile'], (old) => {
        if (!old) return old
        return {
          ...old,
          workspaces: old.workspaces.filter(
            (w) => w.workspace.$id !== param.workspaceId
          )
        }
      })

      return { previousProfile }
    },
    onSuccess: () => {
      toast.success('You left the workspace', {
        description: 'You have successfully left the workspace.'
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile)
      }

      const errorMessage = error.message || 'Error leaving the workspace'

      // Handle specific error cases
      if (errorMessage.includes('last admin')) {
        toast.error('You cannot leave the workspace', {
          description:
            'You are the last administrator. Assign another administrator first.'
        })
      } else {
        toast.error('Error leaving the workspace', {
          description: errorMessage
        })
      }
    }
  })

  return mutation
}
