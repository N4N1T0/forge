import 'server-only'

import {
  APPWRITE_API_KEY,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID
} from '@/config'
import { AUTH_COOKIE } from '@/features/auth/constants'
import { AdminMiddleWareContext, MiddleWareContext } from '@/types/functions'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import {
  Account,
  Avatars,
  Client,
  Storage,
  TablesDB,
  Users
} from 'node-appwrite'

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
    const tables = new TablesDB(client)
    const avatar = new Avatars(client)
    const storage = new Storage(client)
    const user = await account?.get()

    c.set('account', account)
    c.set('tables', tables)
    c.set('storage', storage)
    c.set('user', user)
    c.set('avatar', avatar)

    await next()
  }
)

export const adminMiddleware = createMiddleware<AdminMiddleWareContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_API_KEY)

    const account = new Account(client)
    const tables = new TablesDB(client)
    const storage = new Storage(client)
    const users = new Users(client)

    c.set('account', account)
    c.set('tables', tables)
    c.set('storage', storage)
    c.set('users', users)

    await next()
  }
)
