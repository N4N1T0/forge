import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.project)[':projectId']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.project)[':projectId']['$patch']
>

// HOOK
export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.project[':projectId']['$patch']({
        form,
        param
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: (data) => {
      toast.success('Project updated successfully', {
        description: 'Your project has been updated.'
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      if (data.success)
        queryClient.invalidateQueries({
          queryKey: ['projects', data.data.$id]
        })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error updating project'

      switch (true) {
        case errorMessage.includes('project_name_taken'):
          toast.error('Project name already in use', {
            description: 'Please choose a different name for your project.'
          })
          break
        case errorMessage.includes('project_limit_reached'):
          toast.error('Project limit reached', {
            description:
              'You have reached the maximum number of allowed projects.'
          })
          break
        case errorMessage.includes('invalid_project_name'):
          toast.error('Invalid project name', {
            description:
              'The project name contains invalid characters or is too short.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error updating project', {
            description:
              'The provided data is invalid. Please verify the information.'
          })
          break
        default:
          toast.error('Error updating project', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
