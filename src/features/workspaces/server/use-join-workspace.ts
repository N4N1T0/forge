import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.workspace)[':workspaceId']['join']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.workspace)[':workspaceId']['join']['$post']
>

// HOOK
export const useJoinWorkspace = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspace[':workspaceId']['join'][
        '$post'
      ]({
        param,
        json
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: (data) => {
      toast.success('Te has unido al espacio de trabajo exitosamente', {
        description: 'Has sido agregado al espacio de trabajo.'
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
        error.message || 'Error al unirte al espacio de trabajo'

      switch (true) {
        case errorMessage.includes('workspace_not_found'):
          toast.error('Espacio de trabajo no encontrado', {
            description:
              'No se pudo encontrar el espacio de trabajo que intentas unirte.'
          })
          break
        case errorMessage.includes('unauthorized'):
          toast.error('No autorizado', {
            description: 'No tienes permisos para unirte al espacio de trabajo.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error al unirte al espacio de trabajo', {
            description:
              'Los datos proporcionados no son válidos. Por favor, verifica la información.'
          })
          break
        default:
          toast.error('Error al unirte al espacio de trabajo', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
