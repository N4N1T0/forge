/* eslint-disable @typescript-eslint/no-explicit-any */
import { AUTH_COOKIE } from '@/features/auth/constants'
import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema
} from '@/features/auth/schemas/auth-schemas'
import { createAdminClient } from '@/lib/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Context, Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { ID, Models } from 'node-appwrite'
import { ZodError } from 'zod'
import { sessionMiddleware } from './middleware'

// TYPES
type AuthResponse = { success: true } | { success: false; data: string }

// ROUTES
const app = new Hono()
  .get('/current', sessionMiddleware, async (c) => {
    const user = c.get('user')
    return c.json({
      success: true,
      data: user
    })
  })
  .post('/sign-in', zValidator('json', signInSchema), async (c) => {
    try {
      const { email, password } = c.req.valid('json')

      const { account } = await createAdminClient()
      const session = await account.createEmailPasswordSession({
        email,
        password
      })
      setAuthCookie(c, session)

      return c.json<AuthResponse>({
        success: true
      })
    } catch (error: any) {
      if (error instanceof ZodError) {
        return c.json<AuthResponse>({
          success: false,
          data: error.name
        })
      }
      return c.json<AuthResponse>({
        success: false,
        data: error.type
      })
    }
  })
  .post('/sign-up', zValidator('json', signUpSchema), async (c) => {
    try {
      const { email, password, name } = c.req.valid('json')

      const { account } = await createAdminClient()
      await account.create(ID.unique(), email, password, name)
      const session = await account.createEmailPasswordSession({
        email,
        password
      })
      setAuthCookie(c, session)

      return c.json<AuthResponse>({
        success: true
      })
    } catch (error: any) {
      if (error instanceof ZodError) {
        return c.json<AuthResponse>({
          success: false,
          data: error.name
        })
      }
      return c.json<AuthResponse>({
        success: false,
        data: error.type
      })
    }
  })
  .post(
    '/reset-password',
    zValidator('json', resetPasswordSchema),
    async (c) => {
      try {
        const { email } = c.req.valid('json')

        const { account } = await createAdminClient()
        await account.createRecovery({
          email,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
        })

        return c.json<AuthResponse>({
          success: true
        })
      } catch (error: any) {
        if (error instanceof ZodError) {
          return c.json<AuthResponse>({
            success: false,
            data: error.name
          })
        }
        return c.json<AuthResponse>({
          success: false,
          data: error.type
        })
      }
    }
  )
  .post('/logout', sessionMiddleware, async (c) => {
    const account = c.get('account')
    deleteCookie(c, AUTH_COOKIE)
    await account.deleteSession({
      sessionId: 'current'
    })

    return c.json({
      success: true
    })
  })

// HELPERS
function setAuthCookie(c: Context, session: Models.Session) {
  setCookie(c, AUTH_COOKIE, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: 60 * 60 * 24 * 7
  })
}

export default app
