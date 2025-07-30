/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATABASE_ID, WORKSPACES_COLLECTION_ID } from '@/config'
import { sessionMiddleware } from '@/features/auth/server/middleware'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { ID, Models } from 'node-appwrite'
import { createWorkspacesSchema } from '../schema'

// TYPES
type WorkspaceResponse =
  | { success: true; data: Models.Document }
  | { success: false; data: string }

// ROUTES
const app = new Hono().post(
  '/',
  zValidator('json', createWorkspacesSchema),
  sessionMiddleware,
  async (c) => {
    try {
      const databases = c.get('databases')
      const user = c.get('user')
      const { name } = c.req.valid('json')

      console.log(DATABASE_ID)
      console.log(WORKSPACES_COLLECTION_ID)

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        ID.unique(),
        {
          name,
          userId: user.$id
        }
      )

      return c.json<WorkspaceResponse>({
        success: true,
        data: workspace
      })
    } catch (error: any) {
      return c.json<WorkspaceResponse>({
        success: false,
        data: error.type
      })
    }
  }
)

export default app
