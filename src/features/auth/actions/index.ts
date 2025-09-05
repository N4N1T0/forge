import 'server-only'

import { createSessionClient } from '@/lib/appwrite'

export const getCurrentAction = async () => {
  try {
    const { account } = await createSessionClient()

    const user = await account.get()

    return {
      success: true,
      data: user
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
