import 'server-only'

import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '@/config'
import { AUTH_COOKIE } from '@/features/auth/constants'
import { MiddleWareContext } from '@/types/functions'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { Account, Client, Storage, TablesDB } from 'node-appwrite'

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
    const tables = new TablesDB(client) // ✅ replace Databases with Tables
    const storage = new Storage(client)
    const user = await account.get()

    c.set('account', account)
    c.set('tables', tables) // ✅ updated key
    c.set('storage', storage)
    c.set('user', user)

    await next()
  }
)
