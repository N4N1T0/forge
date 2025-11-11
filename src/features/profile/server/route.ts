import {
  DATABASE_ID,
  MEMBERS_COLLECTION_ID,
  WORKSPACES_COLLECTION_ID
} from '@/config'
import {
  changePasswordSchema,
  ChangePasswordSchema,
  deleteAccountSchema,
  DeleteAccountSchema,
  updateProfileSchema,
  UpdateProfileSchema,
  verifyMFASchema,
  VerifyMFASchema
} from '@/features/profile/schemas/profile-schemas'
import { ProfileData } from '@/features/profile/types'
import { createAdminClient } from '@/lib/appwrite'
import { sessionMiddleware } from '@/lib/middleware'
import { Members, Role, Workspaces } from '@/types/appwrite'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { AuthenticatorType, Query } from 'node-appwrite'

// TYPES
type ProfileResponse =
  | { success: true; data: ProfileData }
  | { success: false; data: string }

type UpdateResponse =
  | { success: true; data: { name: string; bio?: string } }
  | { success: false; data: string }

type PasswordResponse =
  | { success: true; data: { message: string } }
  | { success: false; data: string }

type MFAResponse =
  | { success: true; data: { qr: string; challengeId: string } }
  | { success: false; data: string }

type MFADisableResponse =
  | { success: true; data: { message: string } }
  | { success: false; data: string }

type MFAVerifyResponse =
  | { success: true; data: { message: string; recoveryCodes: string[] } }
  | { success: false; data: string }

type LeaveWorkspaceResponse =
  | { success: true; data: { workspaceId: string } }
  | { success: false; data: string }

type DeleteAccountResponse =
  | { success: true; data: { message: string } }
  | { success: false; data: string }

// ROUTES
const app = new Hono()
  // GET PROFILE DATA
  .get('/', sessionMiddleware, async (c) => {
    try {
      const account = c.get('account')
      const databases = c.get('tables')
      const user = c.get('user')

      const prefs = await account.getPrefs()
      const bio = prefs.bio as string | undefined

      const mfaFactors = await account.listMFAFactors()
      const mfaEnabled = mfaFactors.totp

      const memberships = await databases.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        queries: [Query.equal('userId', user.$id)]
      })

      const workspaceData = await Promise.all(
        memberships.rows.map(async (member) => {
          const workspace = await databases.getRow<Workspaces>({
            databaseId: DATABASE_ID,
            tableId: WORKSPACES_COLLECTION_ID,
            rowId: member.workspaceId!
          })

          const admins = await databases.listRows<Members>({
            databaseId: DATABASE_ID,
            tableId: MEMBERS_COLLECTION_ID,
            queries: [
              Query.equal('workspaceId', member.workspaceId!),
              Query.equal('role', Role.ADMIN)
            ]
          })

          const isLastAdmin = admins.total === 1 && member.role === Role.ADMIN

          return {
            workspace,
            role: member.role,
            isLastAdmin
          }
        })
      )

      const profileData: ProfileData = {
        $id: user.$id,
        name: user.name,
        email: user.email,
        bio,
        mfaEnabled,
        workspaces: workspaceData
      }

      return c.json<ProfileResponse>({
        success: true,
        data: profileData
      })
    } catch (error) {
      return c.json<ProfileResponse>({
        success: false,
        data: error instanceof Error ? error.message : 'Failed to fetch profile'
      })
    }
  })
  // UPDATE PROFILE DATA
  .patch(
    '/',
    sessionMiddleware,
    zValidator('json', updateProfileSchema),
    async (c) => {
      try {
        const account = c.get('account')
        const { name, bio } = c.req.valid('json') as UpdateProfileSchema

        await account.updateName({
          name
        })

        const currentPrefs = await account.getPrefs()
        await account.updatePrefs({
          ...currentPrefs,
          bio: bio || ''
        })

        return c.json<UpdateResponse>({
          success: true,
          data: { name, bio }
        })
      } catch (error) {
        return c.json<UpdateResponse>({
          success: false,
          data:
            error instanceof Error ? error.message : 'Failed to update profile'
        })
      }
    }
  )
  // UPDATE PASSWORD
  .post(
    '/password',
    sessionMiddleware,
    zValidator('json', changePasswordSchema),
    async (c) => {
      try {
        const account = c.get('account')
        const { currentPassword, newPassword } = c.req.valid(
          'json'
        ) as ChangePasswordSchema

        await account.updatePassword({
          oldPassword: currentPassword,
          password: newPassword
        })

        return c.json<PasswordResponse>({
          success: true,
          data: { message: 'Password changed successfully' }
        })
      } catch (error) {
        return c.json<PasswordResponse>({
          success: false,
          data:
            error instanceof Error ? error.message : 'Failed to change password'
        })
      }
    }
  )
  // MFA ENABLE
  .post('/mfa/enable', sessionMiddleware, async (c) => {
    try {
      const account = c.get('account')
      const avatars = c.get('avatar')

      const mfaChallenge = await account.createMFAAuthenticator({
        type: AuthenticatorType.Totp
      })

      const result = await avatars.getQR({
        text: mfaChallenge.uri,
        size: 800,
        margin: 0,
        download: false
      })

      const buffer = Buffer.from(result)
      const base64String = buffer.toString('base64')
      const dataUrl = `data:image/png;base64,${base64String}`

      return c.json<MFAResponse>({
        success: true,
        data: {
          qr: dataUrl,
          challengeId: mfaChallenge.secret
        }
      })
    } catch (error) {
      return c.json<MFAResponse>({
        success: false,
        data: error instanceof Error ? error.message : 'Failed to enable MFA'
      })
    }
  })
  // MFA VERIFY
  .post(
    '/mfa/verify',
    sessionMiddleware,
    zValidator('json', verifyMFASchema),
    async (c) => {
      try {
        const account = c.get('account')
        const { otp } = c.req.valid('json') as VerifyMFASchema

        await account.updateMFAAuthenticator({
          type: AuthenticatorType.Totp,
          otp
        })

        const recoveryCodesResponse = await account.createMFARecoveryCodes()

        return c.json<MFAVerifyResponse>({
          success: true,
          data: {
            message: 'MFA verified successfully',
            recoveryCodes: recoveryCodesResponse.recoveryCodes
          }
        })
      } catch (error) {
        return c.json<MFAVerifyResponse>({
          success: false,
          data: error instanceof Error ? error.message : 'Failed to verify MFA'
        })
      }
    }
  )
  // MFA DISABLE
  .post('/mfa/disable', sessionMiddleware, async (c) => {
    try {
      const account = c.get('account')

      await account.deleteMFAAuthenticator({
        type: AuthenticatorType.Totp
      })

      return c.json<MFADisableResponse>({
        success: true,
        data: { message: 'MFA disabled successfully' }
      })
    } catch (error) {
      return c.json<MFADisableResponse>({
        success: false,
        data: error instanceof Error ? error.message : 'Failed to disable MFA'
      })
    }
  })
  // LEAVE WORKSPACES
  .delete('/workspace/:workspaceId', sessionMiddleware, async (c) => {
    try {
      const databases = c.get('tables')
      const user = c.get('user')
      const { workspaceId } = c.req.param()

      const memberships = await databases.listRows<Members>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        queries: [
          Query.equal('userId', user.$id),
          Query.equal('workspaceId', workspaceId)
        ]
      })

      if (memberships.total === 0) {
        return c.json<LeaveWorkspaceResponse>({
          success: false,
          data: 'You are not a member of this workspace'
        })
      }

      const membership = memberships.rows[0]

      if (membership.role === Role.ADMIN) {
        const admins = await databases.listRows<Members>({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_COLLECTION_ID,
          queries: [
            Query.equal('workspaceId', workspaceId),
            Query.equal('role', Role.ADMIN)
          ]
        })

        if (admins.total === 1) {
          return c.json<LeaveWorkspaceResponse>({
            success: false,
            data: 'Cannot leave workspace as the last admin'
          })
        }
      }

      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_COLLECTION_ID,
        rowId: membership.$id
      })

      return c.json<LeaveWorkspaceResponse>({
        success: true,
        data: { workspaceId }
      })
    } catch (error) {
      return c.json<LeaveWorkspaceResponse>({
        success: false,
        data:
          error instanceof Error ? error.message : 'Failed to leave workspace'
      })
    }
  })
  // DELETE ACCOUNT
  .delete(
    '/account',
    sessionMiddleware,
    zValidator('json', deleteAccountSchema),
    async (c) => {
      try {
        const databases = c.get('tables')
        const user = c.get('user')
        const { email } = c.req.valid('json') as DeleteAccountSchema

        if (email !== user.email) {
          return c.json<DeleteAccountResponse>({
            success: false,
            data: 'Email does not match'
          })
        }

        const memberships = await databases.listRows<Members>({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_COLLECTION_ID,
          queries: [Query.equal('userId', user.$id)]
        })

        await Promise.all(
          memberships.rows.map((membership) =>
            databases.deleteRow({
              databaseId: DATABASE_ID,
              tableId: MEMBERS_COLLECTION_ID,
              rowId: membership.$id
            })
          )
        )

        const { users } = await createAdminClient()
        await users.delete({
          userId: user.$id
        })

        return c.json<DeleteAccountResponse>({
          success: true,
          data: { message: 'Account deleted successfully' }
        })
      } catch (error) {
        return c.json<DeleteAccountResponse>({
          success: false,
          data:
            error instanceof Error ? error.message : 'Failed to delete account'
        })
      }
    }
  )

export default app
