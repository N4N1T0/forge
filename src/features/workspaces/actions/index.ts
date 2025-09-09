import 'server-only'

import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACES_COLLECTION_ID
} from '@/config'
import { getMember } from '@/features/members/utils'
import { createSessionClient } from '@/lib/appwrite'
import { Members, Workspaces } from '@/types/appwrite'
import { Query } from 'node-appwrite'
import { GetWorkspaceActionProps, GetWorkspaceInfoActionProps } from '@/types'

export const getWorkspacesAction = async () => {
  try {
    const { account, databases } = await createSessionClient()

    const user = await account.get()

    const members = await databases.listRows<Members>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_COLLECTION_ID,
      queries: [Query.equal('userId', user.$id)]
    })

    if (members.total === 0) {
      return {
        success: true,
        data: []
      }
    }

    const workspaceIds = members.rows.map((member) => member.workspaceId)

    const workspaces = await databases.listRows<Workspaces>({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_COLLECTION_ID,
      queries: [
        Query.orderDesc('$createdAt'),
        Query.contains('$id', workspaceIds)
      ]
    })

    return {
      success: true,
      data: workspaces.rows
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
    const { account, databases } = await createSessionClient()
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

    const workspaces = await databases.getRow<Workspaces>({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_COLLECTION_ID,
      rowId: workspaceId
    })

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
    const { databases } = await createSessionClient()

    const workspaces = await databases.getRow<Workspaces>({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_COLLECTION_ID,
      rowId: workspaceId
    })

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
