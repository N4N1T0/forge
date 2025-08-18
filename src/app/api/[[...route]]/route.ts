import authRoute from '@/features/auth/server/route'
import workspaceRoute from '@/features/workspaces/server/route'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
  .route('/login', authRoute)
  .route('/workspace', workspaceRoute)

// EXPORT
export const GET = handle(routes)
export const POST = handle(routes)
export const PATCH = handle(routes)

// TYPES
export type AppType = typeof routes
