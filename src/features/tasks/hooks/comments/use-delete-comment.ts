import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = Extract<
  InferResponseType<
    (typeof client.api.task)[':taskId']['comments'][':commentId']['$delete']
  >,
  { success: true }
>['data']
type RequestType = InferRequestType<
  (typeof client.api.task)[':taskId']['comments'][':commentId']['$delete']
>

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param: { taskId, commentId } }) => {
      const response = await client.api.task[':taskId'].comments[':commentId'][
        '$delete'
      ]({
        param: { taskId, commentId }
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.data)
      }

      return result.data
    },
    onSuccess: ({ taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] })
      toast.success('Comment deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete comment')
    }
  })
}
