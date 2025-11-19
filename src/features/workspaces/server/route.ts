/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACES_COLLECTION_ID
} from '@/config'
import { getMember } from '@/features/members'
import { createWorkspacesSchema } from '@/features/workspaces/schema'
import { sessionMiddleware } from '@/lib/middleware'
import { generateSlug } from '@/lib/utils'
import { Members, Role, Workspaces } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'
import z, { ZodError } from 'zod'

// TYPES
type WorkspaceResponse =
  | { success: true; data: Partial<Workspaces> }
  | { success: false; data: string }

type WorkspaceListResponse =
  | {
      success: true
      data: Workspaces[]
    }
  | {
      success: false
      data: string
    }

// ROUTES
const app = new Hono()
  .get('/', sessionMiddleware, async (c) => {
    try {
      const databases = c.get('tables')
      const user = c.get('user')

      const member = await databases.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        queries: [Query.equal('userId', user.$id)]
      })

      if (member.total === 0) {
        return c.json<WorkspaceListResponse>({
          success: true,
          data: []
        })
      }

      const workspaceIds = member.rows.map(
        (member: Members) => member.workspaceId
      )

      const workspaces = await databases.listRows<Workspaces>({
        databaseId: DATABASE_ID,
        tableId: WORKSPACES_COLLECTION_ID,
        queries: [Query.contains('$id', workspaceIds as string[])]
      })

      return c.json<WorkspaceListResponse>({
        success: true,
        data: workspaces.rows
      })
    } catch (error: any) {
      return c.json<WorkspaceListResponse>({
        success: false,
        data: error.message || 'Failed to fetch workspaces'
      })
    }
  })
  .get('/:workspaceId', sessionMiddleware, async (c) => {
    try {
      const databases = c.get('tables')
      const user = c.get('user')

      const member = await databases.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        queries: [
          Query.equal('userId', user.$id),
          Query.equal('workspaceId', c.req.param('workspaceId'))
        ]
      })

      if (member.total === 0) {
        return c.json<WorkspaceResponse>({
          success: false,
          data: "You're no part of this workspace"
        })
      }

      const workspace = await databases.getRow<Workspaces>({
        databaseId: DATABASE_ID,
        tableId: WORKSPACES_COLLECTION_ID,
        rowId: c.req.param('workspaceId')
      })

      return c.json<WorkspaceResponse>({
        success: true,
        data: workspace
      })
    } catch (error: any) {
      return c.json<WorkspaceResponse>({
        success: false,
        data: error.message || 'Failed to fetch workspaces'
      })
    }
  })
  .post(
    '/',
    zValidator('form', createWorkspacesSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get('tables')
        const user = c.get('user')
        const { name, description, icon, slug } = c.req.valid('form')
        const formattedSlug =
          slug === undefined || slug === '' ? generateSlug(name) : slug

        const workspace = await databases.createRow<Workspaces>({
          databaseId: DATABASE_ID,
          tableId: WORKSPACES_COLLECTION_ID,
          rowId: ID.unique(),
          data: {
            name,
            userId: user.$id,
            description,
            icon,
            slug: formattedSlug
          }
        })

        await databases.createRow({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_COLLECTION_ID,
          rowId: ID.unique(),
          data: {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: Role.ADMIN
          }
        })

        return c.json<WorkspaceResponse>({
          success: true,
          data: workspace
        })
      } catch (error: any) {
        console.log('🚀 ~ error:', error)
        if (error instanceof ZodError) {
          return c.json<WorkspaceResponse>({
            success: false,
            data: error.name
          })
        }
        return c.json<WorkspaceResponse>({
          success: false,
          data: error.type
        })
      }
    }
  )
  .patch(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('form', createWorkspacesSchema),
    async (c) => {
      try {
        const databases = c.get('tables')
        const user = c.get('user')

        const { workspaceId } = c.req.param()
        const { name, description, icon, slug } = c.req.valid('form')
        const formattedSlug =
          slug === undefined || slug === '' ? generateSlug(name) : slug

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id
        })

        if (!member || member.role !== Role.ADMIN) {
          return c.json<WorkspaceResponse>(
            {
              success: false,
              data: 'You are not a member of this workspace'
            },
            401
          )
        }

        const workspace = await databases.updateRow<Workspaces>({
          databaseId: DATABASE_ID,
          tableId: WORKSPACES_COLLECTION_ID,
          rowId: workspaceId,
          data: {
            name,
            description,
            icon,
            slug: formattedSlug
          }
        })

        return c.json<WorkspaceResponse>({
          success: true,
          data: workspace
        })
      } catch (error: any) {
        return c.json<WorkspaceResponse>({
          success: false,
          data: error.message || 'Failed to update workspace'
        })
      }
    }
  )
  .delete('/:workspaceId', sessionMiddleware, async (c) => {
    try {
      const databases = c.get('tables')
      const user = c.get('user')
      const { workspaceId } = c.req.param()

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member || member.role !== Role.ADMIN) {
        return c.json<WorkspaceResponse>(
          {
            success: false,
            data: 'You are not a member of this workspace'
          },
          401
        )
      }

      // TODO: DELETE MEMBERS & TASKS
      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: WORKSPACES_COLLECTION_ID,
        rowId: workspaceId
      })

      return c.json<WorkspaceResponse>({
        success: true,
        data: {
          $id: workspaceId
        }
      })
    } catch (error: any) {
      return c.json<WorkspaceResponse>({
        success: false,
        data: error.message || 'Failed to delete workspace'
      })
    }
  })
  .post(
    '/:workspaceId/join',
    sessionMiddleware,
    zValidator('json', z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param()
      const { code } = c.req.valid('json')

      const databases = c.get('tables')
      const user = c.get('user')

      try {
        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id
        })

        if (member) {
          return c.json<WorkspaceResponse>({
            success: false,
            data: 'Ya eres miembro de este espacio de trabajo'
          })
        }

        const workspace = await databases.getRow<Workspaces>({
          databaseId: DATABASE_ID,
          tableId: WORKSPACES_COLLECTION_ID,
          rowId: workspaceId
        })

        if (workspace.slug !== code) {
          return c.json<WorkspaceResponse>({
            success: false,
            data: 'Código de invitación inválido'
          })
        }

        await databases.createRow<Members>({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_COLLECTION_ID,
          rowId: ID.unique(),
          data: {
            userId: user.$id,
            workspaceId,
            role: Role.MEMBER
          }
        })

        return c.json<WorkspaceResponse>({
          success: true,
          data: {
            $id: workspaceId
          }
        })
      } catch (error: any) {
        return c.json<WorkspaceResponse>({
          success: false,
          data: error.message || 'Failed to join workspace'
        })
      }
    }
  )

export default app
