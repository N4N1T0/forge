import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.login)['forgot-password']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.login)['forgot-password']['$post']
>

export const useForgotPassword = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.login['forgot-password']['$post'](json)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success(
        '¡Enlace enviado! Revisa tu correo electrónico para restablecer tu contraseña'
      )
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error al crear la cuenta'

      switch (true) {
        case errorMessage.includes('user_not_found'):
          toast.error('Usuario no encontrado', {
            description:
              'No se encontró una cuenta con este correo electrónico.'
          })
          break
        case errorMessage.includes('user_email_not_confirmed'):
          toast.error('Correo electrónico no confirmado', {
            description: 'El correo electrónico no ha sido confirmado.'
          })
          break
        case errorMessage.includes('general_rate_limit_exceeded'):
          toast.error('Demasiados intentos', {
            description: 'Demasiados intentos. Inténtalo de nuevo más tarde.'
          })
          break
        default:
          toast.error('Error al enviar el enlace de restablecimiento', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
