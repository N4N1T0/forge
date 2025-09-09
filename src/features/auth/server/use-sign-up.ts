import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.login)['sign-up']['$post']
> & {
  redirect?: string | null | undefined
}
type RequestType = InferRequestType<
  (typeof client.api.login)['sign-up']['$post']
> & {
  redirect?: string | null | undefined
}

export const useSignUp = () => {
  const router = useRouter()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, redirect }) => {
      const response = await client.api.login['sign-up']['$post']({
        json
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return { success: true, redirect }
    },
    onSuccess: ({ redirect }) => {
      toast.success('¡Cuenta creada exitosamente!', {
        description:
          'Bienvenido a Forge. Tu cuenta ha sido creada correctamente.'
      })
      setTimeout(() => {
        if (redirect) {
          router.push(redirect)
        } else {
          router.refresh()
        }
      }, 500)
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error al crear la cuenta'

      switch (true) {
        case errorMessage.includes('user_already_exists') ||
          errorMessage.includes('already exists'):
          toast.error('Usuario ya existe', {
            description: 'Ya existe una cuenta con este correo electrónico.'
          })
          break
        case errorMessage.includes('password'):
          toast.error('Contraseña inválida', {
            description: 'La contraseña no cumple con los requisitos mínimos.'
          })
          break
        case errorMessage.includes('email'):
          toast.error('Correo inválido', {
            description: 'Por favor ingresa un correo electrónico válido.'
          })
          break
        default:
          toast.error('Error al crear cuenta', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
