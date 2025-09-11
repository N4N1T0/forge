import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.project)[':projectId']['$delete']
>
type RequestType = InferRequestType<
  (typeof client.api.project)[':projectId']['$delete']
>

// HOOK
export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.project[':projectId']['$delete']({
        param
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Project deleted successfully', {
        description: 'The project has been permanently deleted.'
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error deleting project'

      switch (true) {
        case errorMessage.includes('project_not_found'):
          toast.error('Project not found', {
            description:
              'The project you are trying to delete could not be found.'
          })
          break
        case errorMessage.includes('unauthorized'):
          toast.error('Unauthorized', {
            description: 'You do not have permission to delete this project.'
          })
          break
        case errorMessage.includes('project_has_dependencies'):
          toast.error('Cannot delete project', {
            description:
              'This project has dependencies that must be removed first.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error deleting project', {
            description:
              'The provided data is invalid. Please verify the information.'
          })
          break
        default:
          toast.error('Error deleting project', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}