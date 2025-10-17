/* eslint-disable @typescript-eslint/no-explicit-any */
import { AUTH_COOKIE } from '@/features/auth/constants'
import {
  otpSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema
} from '@/features/auth/schemas/auth-schemas'
import { createAdminClient } from '@/lib/appwrite'
import { adminMiddleware, sessionMiddleware } from '@/lib/middleware'
import { AdminMiddleWareContext } from '@/types/functions'
import { zValidator } from '@hono/zod-validator'
import { Context, Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { ID, Models, Query } from 'node-appwrite'
import { ZodError } from 'zod'

// TYPES
type AuthResponse =
  | { success: true }
  | { success: false; data: string; userId?: string }

// ROUTES
const app = new Hono()
  .get('/current', sessionMiddleware, async (c) => {
    const user = c.get('user')
    return c.json({
      success: true,
      data: user
    })
  })
  // SIGN IN
  .post(
    '/sign-in',
    adminMiddleware,
    zValidator('json', signInSchema),
    async (c) => {
      try {
        const { email, password } = c.req.valid('json')
        const account = c.get('account')
        const users = c.get('users')

        const user = await users.list({
          queries: [Query.equal('email', email)]
        })

        if (user.total === 0) {
          return c.json<AuthResponse>({
            success: false,
            data: 'user_not_found'
          })
        }

        const session = await account.createEmailPasswordSession({
          email,
          password
        })

        const isSuspicious = await checkSuspiciousSession(
          c,
          user.users[0],
          session
        )
        if (isSuspicious) {
          return c.json<AuthResponse>({
            success: false,
            data: 'suspicious_login_detected',
            userId: user.users[0].$id
          })
        }

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
    }
  )
  // SIGN UP
  .post(
    '/sign-up',
    adminMiddleware,
    zValidator('json', signUpSchema),
    async (c) => {
      try {
        const { email, password, name } = c.req.valid('json')

        const account = c.get('account')
        await account.create({ userId: ID.unique(), email, password, name })
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
    }
  )
  // FORGOT PASSWORD
  .post(
    '/forgot-password',
    zValidator('json', resetPasswordSchema),
    async (c) => {
      try {
        const { email } = c.req.valid('json')

        const { account } = await createAdminClient()
        await account.createRecovery({
          email,
          url: `${process.env.NEXT_PUBLIC_API_URL}/?tab=reset-password`
        })

        return c.json<AuthResponse>({
          success: true
        })
      } catch (error: any) {
        console.log('🚀 ~ error:', error)
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
  // RESET PASSWORD
  .post(
    '/reset-password',
    zValidator('json', updatePasswordSchema),
    async (c) => {
      try {
        const { userId, secret, password } = c.req.valid('json')
        const { account } = await createAdminClient()

        await account.updateRecovery({
          userId,
          secret,
          password
        })

        return c.json<AuthResponse>({ success: true })
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
  // OTP VERIFICATION
  .post('/verify-otp', zValidator('json', otpSchema), async (c) => {
    try {
      const { userId, secret } = c.req.valid('json')
      const { account } = await createAdminClient()

      const session = await account.createSession({
        userId,
        secret
      })
      setAuthCookie(c, session)

      return c.json<AuthResponse>({ success: true })
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
  // SIGN OUT
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

async function checkSuspiciousSession(
  c: Context<AdminMiddleWareContext>,
  user: Models.User,
  currentSession: Models.Session
): Promise<boolean> {
  try {
    const account = c.get('account')
    const users = c.get('users')
    const sessions = await users.listSessions({
      userId: user.$id
    })

    if (!sessions.sessions?.length) return false

    const previous = sessions.sessions.find(
      (s: any) => s.$id !== currentSession.$id
    )
    if (!previous) return false

    const ipChanged = previous.ip !== currentSession.ip
    const countryChanged = previous.countryCode !== currentSession.countryCode
    const deviceChanged = previous.clientName !== currentSession.clientName
    const tooManySessions = sessions.total > 5

    const isSuspicious =
      ipChanged || countryChanged || deviceChanged || tooManySessions
    if (!isSuspicious) return false

    await account.createEmailToken({
      userId: user.$id,
      email: user.email
    })

    return true
  } catch (err) {
    console.error('Error in checkSuspiciousSession:', err)
    return false
  }
}

export default app
