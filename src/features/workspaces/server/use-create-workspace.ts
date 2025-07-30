import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<(typeof client.api.workspace)['$post']>
type RequestType = InferRequestType<(typeof client.api.workspace)['$post']>

// HOOK
export const useCreateWorkspace = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.workspace['$post'](json)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Workspace created successfully', {
        description: 'Your new workspace has been created.'
      })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error creating workspace'

      switch (true) {
        case errorMessage.includes('workspace_name_taken'):
          toast.error('Workspace name already taken', {
            description: 'Please choose a different name for your workspace.'
          })
          break
        case errorMessage.includes('workspace_limit_reached'):
          toast.error('Workspace limit reached', {
            description:
              'You have reached the maximum number of workspaces allowed.'
          })
          break
        case errorMessage.includes('invalid_workspace_name'):
          toast.error('Invalid workspace name', {
            description:
              'The workspace name contains invalid characters or is too short.'
          })
          break
        default:
          toast.error('Error creating workspace', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
