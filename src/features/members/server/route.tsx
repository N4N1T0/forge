/* eslint-disable @typescript-eslint/no-explicit-any */

import { DATABASE_ID, MEMBERS_COLLECTION_ID } from '@/config'
import { sessionMiddleware } from '@/features/auth/server/middleware'
import { getMember } from '@/features/members/utils'
import { Members, Role } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { Query } from 'node-appwrite'
import { z } from 'zod'

// TYPES
type MemberListResponse =
  | {
      success: true
      data: (Members & { name: string; email: string })[]
    }
  | {
      success: false
      data: string
    }

type DeleteMemberResponse =
  | {
      success: true
      data: Pick<Members, '$id'>
    }
  | {
      success: false
      data: string
    }

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const { workspaceId } = c.req.valid('query')
        const databases = c.get('databases')
        const users = c.get('users')
        const user = c.get('user')

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id
        })

        if (!member) {
          return c.json<MemberListResponse>({
            success: false,
            data: 'No tienes permiso para ver los miembros'
          })
        }

        const members = await databases.listDocuments<Members>(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          [Query.equal('workspaceId', workspaceId)]
        )

        const populatedMembers = await Promise.all(
          members.documents.map(async (member) => {
            try {
              const user = await users.get(member.userId)
              console.log('🚀 ~ members.documents.map ~ user:', user)
              return {
                ...member,
                name: user.name,
                email: user.email
              }
            } catch (error) {
              console.log('🚀 ~ members.documents.map ~ error:', error)
              return member
            }
          })
        )

        console.log('🚀 ~ populatedMembers:', populatedMembers)

        return c.json<MemberListResponse>({
          success: true,
          data: populatedMembers
        })
      } catch (error: any) {
        return c.json<MemberListResponse>({
          success: false,
          data: error.message || 'Failed to fetch members'
        })
      }
    }
  )
  .delete('/:memberId', sessionMiddleware, async (c) => {
    try {
      const databases = c.get('databases')
      const user = c.get('user')
      const { memberId } = c.req.param()

      const memberToDelete = await databases.getDocument<Members>(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        memberId
      )

      const allMembers = await databases.listDocuments<Members>(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        [Query.equal('workspaceId', memberToDelete.workspaceId)]
      )

      const member = await getMember({
        databases,
        workspaceId: memberToDelete.workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json<DeleteMemberResponse>({
          success: false,
          data: 'No tienes permiso para eliminar a este miembro'
        })
      }

      if (member.$id !== memberToDelete.$id && member.role !== Role.ADMIN) {
        return c.json<DeleteMemberResponse>({
          success: false,
          data: 'No puedes eliminar a ti mismo'
        })
      }

      if (allMembers.total === 1) {
        return c.json<DeleteMemberResponse>({
          success: false,
          data: 'No puedes eliminar al único miembro'
        })
      }

      await databases.deleteDocument(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        memberId
      )

      return c.json<DeleteMemberResponse>({
        success: true,
        data: {
          $id: memberId
        }
      })
    } catch (error: any) {
      return c.json<DeleteMemberResponse>({
        success: false,
        data: error.message || 'Failed to delete member'
      })
    }
  })
  .patch(
    '/:memberId',
    sessionMiddleware,
    zValidator('json', z.object({ role: z.enum(Role) })),
    async (c) => {
      try {
        const databases = c.get('databases')
        const user = c.get('user')
        const { memberId } = c.req.param()
        const { role } = c.req.valid('json')

        const memberToUpdate = await databases.getDocument<Members>(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          memberId
        )

        const allMembers = await databases.listDocuments<Members>(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          [Query.equal('workspaceId', memberToUpdate.workspaceId)]
        )

        const member = await getMember({
          databases,
          workspaceId: memberToUpdate.workspaceId,
          userId: user.$id
        })

        if (!member) {
          return c.json<DeleteMemberResponse>({
            success: false,
            data: 'No tienes permiso para modificar a este miembro'
          })
        }

        if (member.role !== Role.ADMIN) {
          return c.json<DeleteMemberResponse>({
            success: false,
            data: 'No puedes modificar a ti mismo'
          })
        }

        if (allMembers.total === 1) {
          return c.json<DeleteMemberResponse>({
            success: false,
            data: 'No puedes modificar al único miembro'
          })
        }

        await databases.updateDocument(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          memberId,
          {
            role: role
          }
        )

        return c.json<DeleteMemberResponse>({
          success: true,
          data: {
            $id: memberId
          }
        })
      } catch (error: any) {
        return c.json<MemberListResponse>({
          success: false,
          data: error.message || 'Failed to delete member'
        })
      }
    }
  )

export default app
