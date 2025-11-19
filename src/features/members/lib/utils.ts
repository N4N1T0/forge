import { DATABASE_ID, MEMBERS_COLLECTION_ID } from '@/config'
import { Members } from '@/types/appwrite'
import { GetMemberParams, GetMembersParams } from '@/types/functions'
import { Query } from 'node-appwrite'

export const getMembers = async ({
  databases,
  workspaceId,
  userId
}: GetMembersParams) => {
  const queries = [Query.equal('workspaceId', workspaceId)]

  if (userId) {
    queries.push(Query.equal('userId', userId))
  }

  const members = await databases.listRows<Members>({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_COLLECTION_ID,
    queries
  })

  return members
}

export const getMember = async ({
  databases,
  workspaceId,
  userId
}: GetMemberParams) => {
  const queries = [Query.equal('userId', userId)]

  if (workspaceId) {
    queries.push(Query.equal('workspaceId', workspaceId))
  }

  const member = await databases.listRows<Members>({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_COLLECTION_ID,
    queries
  })

  return member?.rows[0]
}
