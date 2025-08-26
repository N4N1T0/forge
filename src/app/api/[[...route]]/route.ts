import authRoute from '@/features/auth/server/route'
import memberRoute from '@/features/members/server/route'
import workspaceRoute from '@/features/workspaces/server/route'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
  .route('/login', authRoute)
  .route('/workspace', workspaceRoute)
  .route('/member', memberRoute)

// EXPORT
export const GET = handle(routes)
export const POST = handle(routes)
export const PATCH = handle(routes)
export const DELETE = handle(routes)

// TYPES
export type AppType = typeof routes
