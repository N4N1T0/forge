import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = Extract<
  InferResponseType<(typeof client.api.task)[':taskId']['comments']['$post']>,
  { success: true }
>['data']
type RequestType = InferRequestType<
  (typeof client.api.task)[':taskId']['comments']['$post']
>

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param: { taskId }, json: { content } }) => {
      const response = await client.api.task[':taskId'].comments.$post({
        param: { taskId },
        json: { content }
      })

      if (!response.ok) {
        throw new Error('Failed to create comment')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.data)
      }

      return result.data
    },
    onSuccess: ({ taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] })
      toast.success('Comment added successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add comment')
    }
  })
}
