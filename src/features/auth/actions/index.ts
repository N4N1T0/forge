import 'server-only'

import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '@/config'
import { AUTH_COOKIE } from '@/features/auth/constants'
import { cookies } from 'next/headers'
import { Account, Client } from 'node-appwrite'

export const getCurrentAction = async () => {
  try {
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)

    const cookie = await cookies()
    const session = cookie.get(AUTH_COOKIE)

    if (!session)
      return {
        success: false,
        data: null
      }

    client.setSession(session.value)
    const account = new Account(client)
    const user = await account.get()

    return {
      success: true,
      data: user
    }
  } catch (error) {
    // TODO
    console.log('🚀 ~ getWorkspaces ~ error:', error)
    return {
      success: false,
      data: null
    }
  }
}
