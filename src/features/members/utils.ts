import { DATABASE_ID, MEMBERS_COLLECTION_ID } from '@/config'
import { Members } from '@/types/appwrite'
import { GetMembersParams } from '@/types/functions'
import { Query } from 'node-appwrite'

export const getMember = async ({
  databases,
  workspaceId,
  userId
}: GetMembersParams) => {
  const members = await databases.listRows<Members>({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_COLLECTION_ID,
    queries: [
      Query.equal('userId', userId),
      Query.equal('workspaceId', workspaceId)
    ]
  })

  return members.rows[0]
}
