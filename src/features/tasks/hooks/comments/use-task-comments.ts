import { client } from '@/lib/rpc'
import { useInfiniteQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

// TYPES
type ResponseType = Extract<
  InferResponseType<(typeof client.api.task)[':taskId']['comments']['$get']>,
  { success: true }
>['data']

export const useTaskComments = (taskId: string) => {
  return useInfiniteQuery<ResponseType>({
    queryKey: ['task-comments', taskId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.api.task[':taskId'].comments.$get({
        param: { taskId },
        query: { page: (pageParam as number).toString(), limit: '20' }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.data)
      }

      return result.data
    },
    getNextPageParam: (lastPage: ResponseType) => {
      const hasMore = lastPage.comments.length === lastPage.limit
      return hasMore ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
    enabled: !!taskId
  })
}
