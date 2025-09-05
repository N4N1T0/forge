/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACES_COLLECTION_ID
} from '@/config'
import { sessionMiddleware } from '@/features/auth/server/middleware'
import { getMember } from '@/features/members/utils'
import { createWorkspacesSchema } from '@/features/workspaces/schema'
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
      const databases = c.get('databases')
      const user = c.get('user')

      const member = await databases.listDocuments<Members>(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        [Query.equal('userId', user.$id)]
      )

      if (member.total === 0) {
        return c.json<WorkspaceListResponse>({
          success: true,
          data: []
        })
      }

      const workspaceIds = member.documents.map(
        (member: Members) => member.workspaceId
      )

      const workspaces = await databases.listDocuments<Workspaces>(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        [Query.contains('$id', workspaceIds)]
      )

      return c.json<WorkspaceListResponse>({
        success: true,
        data: workspaces.documents
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
      const databases = c.get('databases')
      const user = c.get('user')

      const member = await databases.listDocuments<Members>(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        [
          Query.equal('userId', user.$id),
          Query.equal('workspaceId', c.req.param('workspaceId'))
        ]
      )

      if (member.total === 0) {
        return c.json<WorkspaceResponse>({
          success: false,
          data: "You're no part of this workspace"
        })
      }

      const workspace = await databases.getDocument<Workspaces>(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        c.req.param('workspaceId')
      )

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
        const databases = c.get('databases')
        const user = c.get('user')
        const { name, description, icon, slug, theme } = c.req.valid('form')
        const formattedSlug =
          slug === undefined || slug === '' ? generateSlug(name) : slug

        const workspace = await databases.createDocument<Workspaces>(
          DATABASE_ID,
          WORKSPACES_COLLECTION_ID,
          ID.unique(),
          {
            name,
            userId: user.$id,
            description,
            icon,
            slug: formattedSlug,
            theme
          }
        )

        await databases.createDocument(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          ID.unique(),
          {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: Role.ADMIN
          }
        )

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
        const databases = c.get('databases')
        const user = c.get('user')

        const { workspaceId } = c.req.param()
        const { name, description, icon, slug, theme } = c.req.valid('form')
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

        const workspace = await databases.updateDocument<Workspaces>(
          DATABASE_ID,
          WORKSPACES_COLLECTION_ID,
          workspaceId,
          {
            name,
            description,
            icon,
            slug: formattedSlug,
            theme
          }
        )

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
      const databases = c.get('databases')
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
      await databases.deleteDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId
      )

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

      const databases = c.get('databases')
      const user = c.get('user')

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

      const workspace = await databases.getDocument<Workspaces>(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId
      )

      if (workspace.slug !== code) {
        return c.json<WorkspaceResponse>({
          success: false,
          data: 'Código de invitación inválido'
        })
      }

      await databases.createDocument<Members>(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId,
          role: Role.MEMBER
        }
      )

      return c.json<WorkspaceResponse>({
        success: true,
        data: {
          $id: workspaceId
        }
      })
    }
  )

export default app
