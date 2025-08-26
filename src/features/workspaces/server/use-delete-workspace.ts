import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.workspace)[':workspaceId']['$delete']
>
type RequestType = InferRequestType<
  (typeof client.api.workspace)[':workspaceId']['$delete']
>

// HOOK
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      console.log('🚀 ~ mutationFn: ~ param:', param)
      const response = await client.api.workspace[':workspaceId']['$delete']({
        param
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: (data) => {
      toast.success('Espacio de trabajo eliminado exitosamente', {
        description: 'El espacio de trabajo ha sido eliminado.'
      })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ['workspaces', data.data.$id]
        })
      }
    },
    onError: (error) => {
      const errorMessage =
        error.message || 'Error al eliminar el espacio de trabajo'

      switch (true) {
        case errorMessage.includes('workspace_not_found'):
          toast.error('Espacio de trabajo no encontrado', {
            description:
              'No se pudo encontrar el espacio de trabajo que intentas eliminar.'
          })
          break
        case errorMessage.includes('unauthorized'):
          toast.error('No autorizado', {
            description:
              'No tienes permisos para eliminar este espacio de trabajo.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error al eliminar el espacio de trabajo', {
            description:
              'Los datos proporcionados no son válidos. Por favor, verifica la información.'
          })
          break
        default:
          toast.error('Error al eliminar el espacio de trabajo', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
