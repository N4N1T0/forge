import 'server-only'

import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACES_COLLECTION_ID
} from '@/config'
import { AUTH_COOKIE } from '@/features/auth/constants'
import { getMember } from '@/features/members/utils'
import { Members, Workspaces } from '@/types/appwrite'
import { cookies } from 'next/headers'
import { Account, Client, Databases, Query } from 'node-appwrite'

export const getWorkspacesAction = async () => {
  try {
    // TODO
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
    const databases = new Databases(client)
    const account = new Account(client)
    const user = await account.get()

    const members = await databases.listDocuments<Members>(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      [Query.equal('userId', user.$id)]
    )

    if (members.total === 0) {
      return {
        success: true,
        data: []
      }
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId)

    const workspaces = await databases.listDocuments<Workspaces>(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)]
    )

    return {
      success: true,
      data: workspaces.documents
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

export const getWorkspaceAction = async ({
  workspaceId
}: GetWorkspaceActionProps) => {
  try {
    // TODO
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
    const databases = new Databases(client)
    const account = new Account(client)
    const user = await account.get()

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId
    })

    if (!member) {
      return {
        success: false,
        data: null
      }
    }

    const workspaces = await databases.getDocument<Workspaces>(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      workspaceId
    )

    return {
      success: true,
      data: workspaces
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
