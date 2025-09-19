/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  TASKS_COLLECTION_ID
} from '@/config'
import { getMember } from '@/features/members/utils'
import { createTaskSchema } from '@/features/tasks/schema'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/middleware'
import { Members, Projects, Status, Tasks } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { AppwriteException, ID, Query } from 'node-appwrite'
import z, { ZodError } from 'zod'

// TYPES
type TaskResponse =
  | { success: true; data: Partial<Tasks> }
  | { success: false; data: string }

type TaskListResponse =
  | {
      success: true
      data: (Tasks & {
        project: Projects | undefined
        assignee:
          | (Members & {
              name: string
              email: string
            })
          | undefined
      })[]
    }
  | {
      success: false
      data: string
    }

// ROUTES
const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.enum(Status).nullish(),
        search: z.string().nullish(),
        dueDate: z.coerce.date().nullish()
      })
    ),
    async (c) => {
      const { users } = await createAdminClient()
      const databases = c.get('tables')
      const user = c.get('user')

      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid('query')

      const member = getMember({
        databases,
        userId: user.$id,
        workspaceId
      })

      if (!member) {
        return c.json<TaskListResponse>(
          {
            success: false,
            data: 'You are not a member of this workspace'
          },
          403
        )
      }

      const query = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt')
      ]

      if (projectId) {
        query.push(Query.equal('projectId', projectId))
      }

      if (assigneeId) {
        query.push(Query.equal('assigneeId', assigneeId))
      }

      if (status) {
        query.push(Query.equal('status', status))
      }

      if (search) {
        query.push(Query.search('name', search))
      }

      if (dueDate) {
        query.push(Query.equal('dueDate', dueDate.toISOString()))
      }

      const tasks = await databases.listRows<Tasks>({
        databaseId: DATABASE_ID,
        tableId: TASKS_COLLECTION_ID,
        queries: query
      })

      const projectsId = [...new Set(tasks.rows.map((task) => task.projectId))]
      const assigneesId = [
        ...new Set(tasks.rows.map((task) => task.assigneeId))
      ]

      const projects = await databases.listRows<Projects>({
        databaseId: DATABASE_ID,
        tableId: PROJECTS_COLLECTION_ID,
        queries:
          projectsId.length > 0 ? [Query.contains('$id', projectsId)] : []
      })

      const members = await databases.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        queries:
          assigneesId.length > 0 ? [Query.contains('userId', assigneesId)] : []
      })

      const assignees = await Promise.all(
        members.rows.map(async (member) => {
          const user = await users.get({
            userId: member.userId as string
          })
          return {
            ...member,
            name: user.name,
            email: user.email
          }
        })
      )

      const populatedTasks = tasks.rows.map((task) => ({
        ...task,
        project: projects.rows.find(
          (project) => project.$id === task.projectId
        ),
        assignee: assignees.find((assignee) => assignee.$id === task.assigneeId)
      }))

      return c.json<TaskListResponse>({
        success: true,
        data: populatedTasks
      })
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (c) => {
      const user = c.get('user')
      const databases = c.get('tables')
      const {
        name,
        description,
        projectId,
        workspaceId,
        assigneeId,
        dueDate,
        status
      } = c.req.valid('json')

      try {
        const member = await getMember({
          databases,
          userId: user.$id,
          workspaceId
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

        const highestPosition = await databases.listRows<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          queries: [
            Query.equal('status', status),
            Query.equal('workspaceId', workspaceId),
            Query.orderAsc('position'),
            Query.limit(1)
          ]
        })

        const position =
          highestPosition?.total === 0
            ? 2000
            : highestPosition?.rows[0].position + 1000

        const task = await databases.createRow<Tasks>({
          databaseId: DATABASE_ID,
          tableId: TASKS_COLLECTION_ID,
          rowId: ID.unique(),
          data: {
            name,
            description,
            projectId,
            workspaceId,
            assigneeId,
            dueDate: dueDate,
            status,
            position
          }
        })

        return c.json<TaskResponse>({
          success: true,
          data: task
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
          data: error.message || 'Failed to delete project'
        })
      }
    }
  )

export default app
