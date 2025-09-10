import { DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/config'
import { getMember } from '@/features/members/utils'
import { sessionMiddleware } from '@/lib/middleware'
import { Projects } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { AppwriteException, ID, Models, Query } from 'node-appwrite'
import z, { ZodError } from 'zod'
import { createProjectSchema } from '../schema'

// TYPES
type ProjectListResponse =
  | {
      success: true
      data: Models.RowList<Projects>
    }
  | {
      success: false
      data: string
    }

type ProjectResponse =
  | {
      success: true
      data: Models.RowList<Projects>['rows'][number]
    }
  | {
      success: false
      data: string
    }

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string()
      })
    ),
    async (c) => {
      const user = c.get('user')
      const databases = c.get('tables')
      const { workspaceId } = c.req.valid('query')

      if (!workspaceId) {
        return c.json<ProjectListResponse>({
          success: false,
          data: 'Workspace ID is required'
        })
      }

      try {
        const member = getMember({
          databases,
          userId: user.$id,
          workspaceId
        })

        if (!member) {
          return c.json<ProjectListResponse>({
            success: false,
            data: 'Your are not a member of this Project'
          })
        }

        const projects = await databases.listRows<Projects>({
          databaseId: DATABASE_ID,
          tableId: PROJECTS_COLLECTION_ID,
          queries: [
            Query.equal('workspaceId', workspaceId),
            Query.orderDesc('$createdAt')
          ]
        })

        return c.json<ProjectListResponse>({
          success: true,
          data: projects
        })
      } catch (error) {
        console.log('🚀 ~ error:', error)
        if (error instanceof ZodError) {
          return c.json<ProjectListResponse>({
            success: false,
            data: 'An Validation Error has occurred'
          })
        }
        if (error instanceof AppwriteException) {
          return c.json<ProjectListResponse>({
            success: false,
            data: 'An Appwrite Error has occurred'
          })
        }
        return c.json<ProjectListResponse>({
          success: false,
          data: 'An unknown error occurred'
        })
      }
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (c) => {
      try {
        const databases = c.get('tables')
        const user = c.get('user')
        const { name, shortcut, workspaceId } = c.req.valid('form')

        const member = getMember({
          databases,
          userId: user.$id,
          workspaceId
        })

        if (!member) {
          return c.json<ProjectResponse>({
            success: false,
            data: 'Your are not a member of this Project'
          })
        }

        const project = await databases.createRow<Projects>({
          databaseId: DATABASE_ID,
          tableId: PROJECTS_COLLECTION_ID,
          rowId: ID.unique(),
          data: {
            name,
            shortcut,
            workspaceId: workspaceId
          }
        })

        return c.json<ProjectResponse>({
          success: true,
          data: project
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return c.json<ProjectResponse>({
            success: false,
            data: 'An Validation Error has occurred'
          })
        }
        if (error instanceof AppwriteException) {
          return c.json<ProjectResponse>({
            success: false,
            data: 'An Appwrite Error has occurred'
          })
        }
        return c.json<ProjectResponse>({
          success: false,
          data: 'An unknown error occurred'
        })
      }
    }
  )

export default app
