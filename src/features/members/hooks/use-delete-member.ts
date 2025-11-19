import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.member)[':memberId']['$delete']
>
type RequestType = InferRequestType<
  (typeof client.api.member)[':memberId']['$delete']
>

// HOOK
export const useDeleteMember = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.member[':memberId']['$delete']({
        param
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Miembro eliminado exitosamente', {
        description: 'El miembro ha sido eliminado.'
      })
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error al eliminar el miembro'

      switch (true) {
        case errorMessage.includes('member_not_found'):
          toast.error('Miembro no encontrado', {
            description:
              'No se pudo encontrar el miembro que intentas eliminar.'
          })
          break
        case errorMessage.includes('unauthorized'):
          toast.error('No autorizado', {
            description: 'No tienes permisos para eliminar este miembro.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error al eliminar el miembro', {
            description:
              'Los datos proporcionados no son válidos. Por favor, verifica la información.'
          })
          break
        default:
          toast.error('Error al eliminar el miembro', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
