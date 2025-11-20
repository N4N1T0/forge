'use client'

import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.login)['reset-password']['$post']
>

type RequestType = InferRequestType<
  (typeof client.api.login)['reset-password']['$post']
>

// HOOK
export const useResetPassword = () => {
  const router = useRouter()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.login['reset-password']['$post']({
        json
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return { success: true }
    },
    onSuccess: () => {
      toast.success('¡Contraseña actualizada correctamente!', {
        description:
          'Tu contraseña fue restablecida exitosamente. Inicia sesión con tu nueva contraseña.'
      })
      setTimeout(() => {
        router.push('/?tab=sign-in')
      }, 500)
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error al restablecer la contraseña'

      switch (true) {
        case errorMessage.includes('password_mismatch'):
          toast.error('Las contraseñas no coinciden', {
            description: 'Asegúrate de que ambas contraseñas sean iguales.'
          })
          break
        case errorMessage.includes('user_not_found'):
          toast.error('Usuario no encontrado', {
            description: 'El enlace de recuperación no es válido o ha expirado.'
          })
          break
        default:
          toast.error('Error al restablecer contraseña', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
