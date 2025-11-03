/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  TASK_COMMENTS_COLLECTION_ID,
  TASKS_COLLECTION_ID
} from '@/config'
import { getMember } from '@/features/members/utils'
import { createCommentSchema, getCommentsSchema } from '@/features/tasks/schema'
import { checkRateLimit, sanitizeContent } from '@/features/tasks/utils'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/middleware'
import { Members, TaskComments, Tasks } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { AppwriteException, ID, Query } from 'node-appwrite'
import { ZodError } from 'zod'

// TYPES
type CommentResponse =
  | { success: true; data: TaskComments }
  | { success: false; data: string }

type CommentsListResponse =
  | {
      success: true
      data: {
        comments: Array<
          TaskComments & {
            author: { name: string; email: string; $id: string }
          }
        >
        total: number
        page: number
        limit: number
      }
    }
  | {
      success: false
      data: string
    }

// ROUTES
const app = new Hono()
  .get(
    '/:taskId/comments',
    sessionMiddleware,
    zValidator('query', getCommentsSchema),
    async (c) => {
      const { users } = await createAdminClient()
      const databases = c.get('tables')
      const user = c.get('user')
      const { taskId } = c.req.param()
      const { page, limit } = c.req.valid('query')

      try {
        const task = await databases.getRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId
        })

        const member = await getMember({
          databases,
          userId: user.$id,
          workspaceId: task.workspaceId
        })

        if (!member) {
          return c.json<CommentsListResponse>(
            {
              success: false,
              data: 'You are not a member of this workspace'
            },
            403
          )
        }

        const offset = (page - 1) * limit

        const commentsResult = await databases.listRows<TaskComments>({
          databaseId: DATABASE_ID,
          tableId: TASK_COMMENTS_COLLECTION_ID,
          queries: [
            Query.equal('taskId', taskId),
            Query.limit(limit),
            Query.offset(offset)
          ]
        })

        const authorIds = [
          ...new Set(commentsResult.rows.map((comment) => comment.authorId))
        ]

        const membersResult = await databases.listRows<Members>({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_COLLECTION_ID,
          queries:
            authorIds.length > 0 ? [Query.contains('$id', authorIds)] : []
        })

        const authorsWithDetails = await Promise.all(
          membersResult.rows.map(async (member) => {
            const userDetails = await users.get({
              userId: member.userId as string
            })
            return {
              $id: member.$id,
              name: userDetails.name,
              email: userDetails.email
            }
          })
        )

        const populatedComments = commentsResult.rows.map((comment) => ({
          ...comment,
          author: authorsWithDetails.find(
            (author) => author.$id === comment.authorId
          ) || {
            $id: comment.authorId,
            name: 'Unknown User',
            email: ''
          }
        }))

        return c.json<CommentsListResponse>({
          success: true,
          data: {
            comments: populatedComments,
            total: commentsResult.total,
            page,
            limit
          }
        })
      } catch (error: any) {
        console.log('🚀 ~ Get comments error:', error)
        if (error instanceof AppwriteException) {
          return c.json<CommentsListResponse>(
            {
              success: false,
              data: error.message
            },
            500
          )
        }
        return c.json<CommentsListResponse>(
          {
            success: false,
            data: error.message || 'Failed to fetch comments'
          },
          500
        )
      }
    }
  )

  // CREATE
  .post(
    '/:taskId/comments',
    sessionMiddleware,
    zValidator('json', createCommentSchema),
    async (c) => {
      const databases = c.get('tables')
      const user = c.get('user')
      const { taskId } = c.req.param()
      const { content } = c.req.valid('json')

      try {
        if (!checkRateLimit(user.$id)) {
          return c.json<CommentResponse>(
            {
              success: false,
              data: 'Rate limit exceeded. Maximum 10 comments per minute.'
            },
            429
          )
        }

        const task = await databases.getRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId
        })

        const member = await getMember({
          databases,
          userId: user.$id,
          workspaceId: task.workspaceId
        })

        if (!member) {
          return c.json<CommentResponse>(
            {
              success: false,
              data: 'You are not a member of this workspace'
            },
            403
          )
        }

        const sanitizedContent = sanitizeContent(content)

        const comment = await databases.createRow<TaskComments>({
          databaseId: DATABASE_ID,
          tableId: TASK_COMMENTS_COLLECTION_ID,
          rowId: ID.unique(),
          data: {
            taskId,
            authorId: member.$id,
            content: sanitizedContent
          }
        })

        return c.json<CommentResponse>({
          success: true,
          data: comment
        })
      } catch (error: any) {
        console.log('🚀 ~ Create comment error:', error)
        if (error instanceof AppwriteException) {
          return c.json<CommentResponse>(
            {
              success: false,
              data: error.message
            },
            500
          )
        }
        if (error instanceof ZodError) {
          return c.json<CommentResponse>(
            {
              success: false,
              data: error.issues.map((e: any) => e.message).join(', ')
            },
            400
          )
        }
        return c.json<CommentResponse>(
          {
            success: false,
            data: error.message || 'Failed to create comment'
          },
          500
        )
      }
    }
  )

  // DELETE COMMENT
  .delete('/:taskId/comments/:commentId', sessionMiddleware, async (c) => {
    const databases = c.get('tables')
    const user = c.get('user')
    const { taskId, commentId } = c.req.param()

    try {
      // Ensure task exists and get workspace
      const task = await databases.getRow<Tasks>({
        databaseId: DATABASE_ID,
        tableId: TASKS_COLLECTION_ID,
        rowId: taskId
      })

      // Ensure requester is a member of the workspace
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: task.workspaceId
      })

      if (!member) {
        return c.json<CommentResponse>(
          {
            success: false,
            data: 'You are not a member of this workspace'
          },
          403
        )
      }

      // Load the comment and verify ownership
      const existingComment = await databases.getRow<TaskComments>({
        databaseId: DATABASE_ID,
        tableId: TASK_COMMENTS_COLLECTION_ID,
        rowId: commentId
      })

      if (!existingComment || existingComment.taskId !== taskId) {
        return c.json<CommentResponse>(
          {
            success: false,
            data: 'Comment not found'
          },
          404
        )
      }

      if (existingComment.authorId !== member.$id) {
        return c.json<CommentResponse>(
          {
            success: false,
            data: 'You are not allowed to delete this comment'
          },
          403
        )
      }

      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: TASK_COMMENTS_COLLECTION_ID,
        rowId: commentId
      })

      return c.json<CommentResponse>({
        success: true,
        data: existingComment
      })
    } catch (error: any) {
      console.log('🚀 ~ Delete comment error:', error)
      if (error instanceof AppwriteException) {
        return c.json<CommentResponse>(
          {
            success: false,
            data: error.message
          },
          500
        )
      }
      return c.json<CommentResponse>(
        {
          success: false,
          data: error.message || 'Failed to delete comment'
        },
        500
      )
    }
  })

export default app
