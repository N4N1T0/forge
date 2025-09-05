import 'server-only'

import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '@/config'
import { AUTH_COOKIE } from '@/features/auth/constants'
import { MiddleWareContext } from '@/types/functions'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { Account, Client, Databases, Storage, Users } from 'node-appwrite'

export const sessionMiddleware = createMiddleware<MiddleWareContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)

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
    const users = new Users(client)
    const user = await account.get()

    c.set('account', account)
    c.set('databases', databases)
    c.set('storage', storage)
    c.set('user', user)
    c.set('users', users)

    await next()
  }
)
