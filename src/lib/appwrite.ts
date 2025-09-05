import 'server-only'

import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '@/config'
import { AUTH_COOKIE } from '@/features/auth/constants'
import { cookies } from 'next/headers'
import { Account, Client, TablesDB, Users } from 'node-appwrite'

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)

  const cookie = await cookies()
  const session = cookie.get(AUTH_COOKIE)

  if (!session || !session.value) {
    throw new Error('No session found')
  }

  client.setSession(session.value)

  return {
    get account() {
      return new Account(client)
    },
    get databases() {
      return new TablesDB(client)
    }
  }
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!)

  return {
    get account() {
      return new Account(client)
    },
    get users() {
      return new Users(client)
    }
  }
}
