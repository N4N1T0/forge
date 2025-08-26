import 'server-only'

import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACES_COLLECTION_ID
} from '@/config'
import { getMember } from '@/features/members/utils'
import { CreateSessionClient } from '@/lib/appwrite'
import { Members, Workspaces } from '@/types/appwrite'
import { Query } from 'node-appwrite'

export const getWorkspacesAction = async () => {
  try {
    const { account, databases } = await CreateSessionClient()

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
    const { account, databases } = await CreateSessionClient()
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

export const getWorkspaceInfoAction = async ({
  workspaceId
}: GetWorkspaceInfoActionProps) => {
  try {
    const { databases } = await CreateSessionClient()

    const workspaces = await databases.getDocument<Workspaces>(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      workspaceId
    )

    return {
      success: true,
      data: {
        name: workspaces.name
      }
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
