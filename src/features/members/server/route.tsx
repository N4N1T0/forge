/* eslint-disable @typescript-eslint/no-explicit-any */

import { DATABASE_ID, MEMBERS_COLLECTION_ID } from '@/config'
import { getMember, getMembers } from '@/features/members/lib/utils'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/middleware'
import { FormattedMembers } from '@/types'
import { Members, Role } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { Models } from 'node-appwrite'
import { z } from 'zod'

// TYPES
type MemberListResponse =
  | {
      success: true
      data: FormattedMembers
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

type MemberResponse =
  | {
      success: true
      data: Members & Models.User<Models.Preferences>
    }
  | {
      success: false
      data: string
    }

// ROUTES
const app = new Hono()
  // GET ALL MEMBERS
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const { workspaceId } = c.req.valid('query')
        const databases = c.get('tables')
        const user = c.get('user')
        const { users } = await createAdminClient()

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

        const members = await getMembers({
          databases,
          workspaceId
        })

        const populatedMembers = await Promise.all(
          members.rows.map(async (member) => {
            try {
              const user = await users.get({
                userId: member.userId as string
              })
              return {
                ...user,
                ...member
              }
            } catch (error) {
              console.log('🚀 ~ members.documents.map ~ error:', error)
              return null
            }
          })
        )

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
  // CURRENT MEMBER
  .get('/member', sessionMiddleware, async (c) => {
    try {
      const databases = c.get('tables')
      const user = c.get('user')

      const member = await getMember({
        databases,
        userId: user.$id
      })

      const formattedMember = {
        ...user,
        ...member
      }

      if (!member) {
        return c.json<MemberResponse>({
          success: false,
          data: 'No se encontró el miembro'
        })
      }

      return c.json<MemberResponse>({
        success: true,
        data: formattedMember
      })
    } catch (error: any) {
      return c.json<MemberResponse>({
        success: false,
        data: error.message || 'Failed to fetch members'
      })
    }
  })
  // DELETE MEMBER
  .delete('/:memberId', sessionMiddleware, async (c) => {
    try {
      const databases = c.get('tables')
      const user = c.get('user')
      const { memberId } = c.req.param()

      const memberToDelete = await databases.getRow<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        rowId: memberId
      })

      const allMembers = await getMembers({
        databases,
        workspaceId: memberToDelete.workspaceId as string
      })

      const member = await getMember({
        databases,
        workspaceId: memberToDelete.workspaceId as string,
        userId: user.$id
      })

      if (!member) {
        return c.json<DeleteMemberResponse>({
          success: false,
          data: 'You do not have permission to delete this member'
        })
      }

      if (member.$id !== memberToDelete.$id && member.role !== Role.ADMIN) {
        return c.json<DeleteMemberResponse>({
          success: false,
          data: 'You can`t remove your self'
        })
      }

      if (allMembers.total === 1) {
        return c.json<DeleteMemberResponse>({
          success: false,
          data: 'You can`t remove the last member'
        })
      }

      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        rowId: memberId
      })

      return c.json<DeleteMemberResponse>({
        success: true,
        data: {
          $id: memberId
        }
      })
    } catch (error: any) {
      console.log('🚀 ~ error:', error)
      return c.json<DeleteMemberResponse>({
        success: false,
        data: error.message || 'Failed to delete member'
      })
    }
  })
  // UPDATE MEMBER
  .patch(
    '/:memberId',
    sessionMiddleware,
    zValidator('json', z.object({ role: z.enum(Role) })),
    async (c) => {
      try {
        const databases = c.get('tables')
        const user = c.get('user')
        const { memberId } = c.req.param()
        const { role } = c.req.valid('json')

        const memberToUpdate = await databases.getRow<Members>({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_COLLECTION_ID,
          rowId: memberId
        })

        const allMembers = await getMembers({
          databases,
          workspaceId: memberToUpdate.workspaceId as string
        })

        const member = await getMember({
          databases,
          workspaceId: memberToUpdate.workspaceId as string,
          userId: user.$id
        })

        if (!member) {
          return c.json<DeleteMemberResponse>({
            success: false,
            data: 'No tienes permiso para modificar a este miembro'
          })
        }

        if (allMembers.total === 1) {
          return c.json<DeleteMemberResponse>({
            success: false,
            data: 'No puedes modificar al único miembro'
          })
        }

        await databases.updateRow({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_COLLECTION_ID,
          rowId: memberId,
          data: {
            role: role
          }
        })

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
