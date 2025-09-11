'use server'

import { DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/config'
import { getMember } from '@/features/members/utils'
import { createSessionClient } from '@/lib/appwrite'
import { GetProjectActionProps } from '@/types'
import { Projects } from '@/types/appwrite'

export const getProjectAction = async ({
  projectId
}: GetProjectActionProps) => {
  try {
    const { account, databases } = await createSessionClient()
    const user = await account.get()

    const project = await databases.getRow<Projects>({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_COLLECTION_ID,
      rowId: projectId
    })

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId
    })

    if (!member) {
      return {
        success: false,
        data: null
      }
    }

    return {
      success: true,
      data: project
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
