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
type RequestType = InferRequestType<
  (typeof client.api.login)['sign-in']['$post']
> & {
  redirect?: string | null | undefined
}

export const useSignIn = () => {
  const router = useRouter()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, redirect }) => {
      const response = await client.api.login['sign-in']['$post']({ json })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return { success: true, redirect }
    },
    onSuccess: ({ redirect }) => {
      toast.success('¡Bienvenido! Has iniciado sesión correctamente')
      setTimeout(() => {
        if (redirect) {
          router.push(redirect)
        } else {
          router.refresh()
        }
      }, 500)
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error al iniciar sesión'

      switch (true) {
        case errorMessage.includes('user_invalid_credentials'):
          toast.error('Credenciales inválidas', {
            description: 'Las credenciales que has ingresado son inválidas.'
          })
          break
        case errorMessage.includes('user_not_found'):
          toast.error('Usuario no encontrado', {
            description:
              'No se encontró una cuenta con este correo electrónico.',
            action: {
              label: 'Regístrate',
              onClick: () => {
                router.push('/?tab=sign-up')
              }
            }
          })
          break
        case errorMessage.includes('user_blocked'):
          toast.error('Usuario bloqueado', {
            description:
              'Tu cuenta ha sido bloqueada. Contacta al administrador.'
          })
          break
        case errorMessage.includes('user_not_found'):
          toast.error('Usuario no encontrado', {
            description:
              'No se encontró una cuenta con este correo electrónico.'
          })
          break
        default:
          toast.error('Error al iniciar sesión', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
