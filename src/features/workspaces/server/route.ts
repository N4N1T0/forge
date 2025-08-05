/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  WORKSPACES_COLLECTION_ID
} from '@/config'
import { sessionMiddleware } from '@/features/auth/server/middleware'
import { Workspaces } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { ID, Models } from 'node-appwrite'
import { ZodError } from 'zod'
import { createWorkspacesSchema } from '../schema'

// TYPES
type WorkspaceResponse =
  | { success: true; data: Models.Document }
  | { success: false; data: string }

// ROUTES
const app = new Hono().post(
  '/',
  zValidator('form', createWorkspacesSchema),
  sessionMiddleware,
  async (c) => {
    try {
      const databases = c.get('databases')
      const storage = c.get('storage')
      const user = c.get('user')
      const { name, image } = c.req.valid('form')

      let uploadedImageUrl: string | null = null
      console.log(IMAGES_BUCKET_ID)

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        )
        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
        console.log('🚀 ~ uploadedImageUrl:', uploadedImageUrl)
      }

      const workspace = await databases.createDocument<Workspaces>(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl
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

export default app
