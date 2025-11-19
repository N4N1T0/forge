'use server'

import { createSessionClient } from '@/lib/appwrite'
import { AppwriteException } from 'node-appwrite'

// CURRENT ACTIONS
export const getCurrentAction = async () => {
  try {
    const { account } = await createSessionClient()

    const user = await account.get()

    return {
      success: true,
      data: user
    }
  } catch (error) {
    if (error instanceof AppwriteException) {
      // TODO: Handle AppwriteException
    }
    return {
      success: false,
      data: null
    }
  }
}
