import authRoute from '@/features/auth/server/route'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app.route('/login', authRoute)

// EXPORT
export const GET = handle(routes)
export const POST = handle(routes)

// TYPES
export type AppType = typeof routes
