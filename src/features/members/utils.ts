import { DATABASE_ID, MEMBERS_COLLECTION_ID } from '@/config'
import { Members } from '@/types/appwrite'
import { GetMembersParams } from '@/types/functions'
import { Query } from 'node-appwrite'

export const getMember = async ({
  databases,
  workspaceId,
  userId
}: GetMembersParams) => {
  const members = await databases.listDocuments<Members>(
    DATABASE_ID,
    MEMBERS_COLLECTION_ID,
    [Query.equal('userId', userId), Query.equal('workspaceId', workspaceId)]
  )

  return members.documents[0]
}
