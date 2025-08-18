import 'server-only'

import { AUTH_COOKIE } from '@/features/auth/constants'
import { MiddleWareContext } from '@/types/functions'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { Account, Client, Databases, Storage } from 'node-appwrite'

export const sessionMiddleware = createMiddleware<MiddleWareContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

    const session = getCookie(c, AUTH_COOKIE)

    if (!session) {
      return c.json(
        {
          success: false,
          message: 'Unauthorized'
        },
        401
      )
    }

    client.setSession(session)

    const account = new Account(client)
    const databases = new Databases(client)
    const storage = new Storage(client)
    const user = await account.get()

    c.set('account', account)
    c.set('databases', databases)
    c.set('storage', storage)
    c.set('user', user)

    await next()
  }
)
