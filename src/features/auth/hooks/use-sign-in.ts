'use client'

import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.login)['sign-in']['$post']
> & {
  redirect?: string | null | undefined
}

type ResponseError = Error & {
  data?: string
  userId?: string
}

type RequestType = InferRequestType<
  (typeof client.api.login)['sign-in']['$post']
> & {
  redirect?: string | null | undefined
}

// HOOK
export const useSignIn = () => {
  const router = useRouter()
  const mutation = useMutation<ResponseType, ResponseError, RequestType>({
    mutationFn: async ({ json, redirect }) => {
      const response = await client.api.login['sign-in']['$post']({ json })
      const data = await response.json()

      if (!data.success) {
        throw { message: data.data, userId: data.userId }
      }

      return { success: true, redirect }
    },
    onSuccess: ({ redirect }) => {
      toast.success('Welcome! You have successfully signed in')
      setTimeout(() => {
        if (redirect) {
          router.push(redirect)
        } else {
          router.refresh()
        }
      }, 500)
    },
    onError: ({ message, userId }) => {
      const errorMessage = message || 'Sign-in error'

      switch (true) {
        case errorMessage.includes('mfa_required'):
          toast.warning('MFA required', {
            description: 'Multi-factor authentication is required.'
          })
          router.push(`/?tab=verify-otp&userId=${userId}`)
          break
        case errorMessage.includes('user_invalid_credentials'):
          toast.error('Invalid credentials', {
            description: 'The credentials you entered are invalid.'
          })
          break
        case errorMessage.includes('user_not_found'):
          toast.error('User not found', {
            description: 'No account was found with this email address.',
            action: {
              label: 'Sign up',
              onClick: () => {
                router.push('/?tab=sign-up')
              }
            }
          })
          break
        case errorMessage.includes('user_blocked'):
          toast.error('User blocked', {
            description:
              'Your account has been blocked. Contact the administrator.'
          })
          break
        case errorMessage.includes('user_not_found'):
          toast.error('User not found', {
            description: 'No account was found with this email address.'
          })
          break
        default:
          toast.error('Sign-in error', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
