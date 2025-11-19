/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATABASE_ID, TASKS_COLLECTION_ID } from '@/config'
import { getMember } from '@/features/members'
import { createTaskSchema } from '@/features/tasks/schema'
import { sessionMiddleware } from '@/lib/middleware'
import { Status, Tasks } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { AppwriteException } from 'node-appwrite'
import z, { ZodError } from 'zod'

// TYPES
type TaskResponse =
  | { success: true; data: Partial<Tasks> }
  | { success: false; data: string }

const app = new Hono()
  // UPDATE TASK
  .patch(
    '/:taskId',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (c) => {
      const user = c.get('user')
      const databases = c.get('tables')
      const { taskId } = c.req.param()
      const { name, description, assigneeId, dueDate, status } =
        c.req.valid('json')

      try {
        const existingTask = await databases.getRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId
        })

        const member = await getMember({
          databases,
          userId: user.$id,
          workspaceId: existingTask.workspaceId
        })

        if (!member) {
          return c.json<TaskResponse>(
            {
              success: false,
              data: 'You are not a member of this workspace'
            },
            403
          )
        }

        const updatedTask = await databases.updateRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId,
          data: {
            name,
            description,
            assigneeId,
            dueDate,
            status
          }
        })

        return c.json<TaskResponse>({
          success: true,
          data: updatedTask
        })
      } catch (error: any) {
        console.log('🚀 ~ error:', error)
        if (error instanceof AppwriteException) {
          return c.json<TaskResponse>({
            success: false,
            data: error.message
          })
        }
        if (error instanceof ZodError) {
          return c.json<TaskResponse>({
            success: false,
            data: error.message
          })
        }
        return c.json<TaskResponse>({
          success: false,
          data: error.message || 'Failed to update task'
        })
      }
    }
  )
  // UPDATE TASK STATUS
  .patch(
    '/:taskId/status',
    sessionMiddleware,
    zValidator('json', z.object({ status: z.enum(Status) })),
    async (c) => {
      const user = c.get('user')
      const databases = c.get('tables')
      const { taskId } = c.req.param()
      const { status } = c.req.valid('json')

      try {
        const existingTask = await databases.getRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId
        })

        const member = await getMember({
          databases,
          userId: user.$id,
          workspaceId: existingTask.workspaceId
        })

        if (!member) {
          return c.json<TaskResponse>(
            {
              success: false,
              data: 'You are not a member of this workspace'
            },
            403
          )
        }

        const updatedTask = await databases.updateRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId,
          data: {
            status
          }
        })

        return c.json<TaskResponse>({
          success: true,
          data: updatedTask
        })
      } catch (error: any) {
        console.log('🚀 ~ error:', error)
        if (error instanceof AppwriteException) {
          return c.json<TaskResponse>({
            success: false,
            data: error.message
          })
        }
        if (error instanceof ZodError) {
          return c.json<TaskResponse>({
            success: false,
            data: error.message
          })
        }
        return c.json<TaskResponse>({
          success: false,
          data: error.message || 'Failed to update task status'
        })
      }
    }
  )
  // UPDATE TASK DUE DATE
  .patch(
    '/:taskId/due-date',
    sessionMiddleware,
    zValidator('json', z.object({ dueDate: z.string() })),
    async (c) => {
      const user = c.get('user')
      const databases = c.get('tables')
      const { taskId } = c.req.param()
      const { dueDate } = c.req.valid('json')

      try {
        const existingTask = await databases.getRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId
        })

        const member = await getMember({
          databases,
          userId: user.$id,
          workspaceId: existingTask.workspaceId
        })

        if (!member) {
          return c.json<TaskResponse>(
            {
              success: false,
              data: 'You are not a member of this workspace'
            },
            403
          )
        }

        const updatedTask = await databases.updateRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: taskId,
          data: {
            dueDate
          }
        })

        return c.json<TaskResponse>({
          success: true,
          data: updatedTask
        })
      } catch (error: any) {
        console.log('🚀 ~ error:', error)
        if (error instanceof AppwriteException) {
          return c.json<TaskResponse>({
            success: false,
            data: error.message
          })
        }
        if (error instanceof ZodError) {
          return c.json<TaskResponse>({
            success: false,
            data: error.message
          })
        }
        return c.json<TaskResponse>({
          success: false,
          data: error.message || 'Failed to update task due date'
        })
      }
    }
  )

export default app
