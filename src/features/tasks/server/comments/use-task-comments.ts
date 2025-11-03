import { client } from '@/lib/rpc'
import { TaskComments } from '@/types/appwrite'
import { useInfiniteQuery } from '@tanstack/react-query'

export interface PopulatedComment extends TaskComments {
  author: {
    $id: string
    name: string
    email: string
  }
}

interface CommentsResponse {
  comments: PopulatedComment[]
  page: number
  limit: number
  total: number
}

export const useTaskComments = (taskId: string) => {
  return useInfiniteQuery({
    queryKey: ['task-comments', taskId],
    queryFn: async ({ pageParam = 1 }): Promise<CommentsResponse> => {
      const response = await client.api.task[':taskId'].comments.$get({
        param: { taskId },
        query: { page: pageParam.toString(), limit: '20' }
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
    getNextPageParam: (lastPage: CommentsResponse) => {
      const hasMore = lastPage.comments.length === lastPage.limit
      return hasMore ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
    enabled: !!taskId
  })
}
