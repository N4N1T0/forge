import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.member)[':memberId']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.member)[':memberId']['$patch']
>

// HOOK
export const useUpdateMember = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.member[':memberId']['$patch']({
        param,
        json
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Miembro actualizado exitosamente', {
        description: 'El miembro ha sido actualizado.'
      })
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error al actualizar el miembro'

      switch (true) {
        case errorMessage.includes('member_not_found'):
          toast.error('Miembro no encontrado', {
            description:
              'No se pudo encontrar el miembro que intentas actualizar.'
          })
          break
        case errorMessage.includes('unauthorized'):
          toast.error('No autorizado', {
            description: 'No tienes permisos para actualizar este miembro.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error al actualizar el miembro', {
            description:
              'Los datos proporcionados no son válidos. Por favor, verifica la información.'
          })
          break
        default:
          toast.error('Error al actualizar el miembro', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
