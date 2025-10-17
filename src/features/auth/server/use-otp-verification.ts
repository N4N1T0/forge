import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type ResponseType = InferResponseType<
  (typeof client.api.login)['verify-otp']['$post']
>
export type RequestType = InferRequestType<
  (typeof client.api.login)['verify-otp']['$post']
>

export const useOtpVerification = () => {
  const router = useRouter()
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.login['verify-otp']['$post']({ json })
      const data = await res.json()

      if (!data.success) {
        throw new Error(
          typeof data.data === 'string' ? data.data : 'OTP inválido'
        )
      }

      return { success: true }
    },
    onSuccess: () => {
      toast.success('Verificación completada')
      router.refresh()
    },
    onError: (error) => {
      const message = error.message || 'Error al verificar OTP'
      toast.error(message)
    }
  })
}
