import 'server-only'

import { CreateSessionClient } from '@/lib/appwrite'

export const getCurrentAction = async () => {
  try {
    const { account } = await CreateSessionClient()

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
