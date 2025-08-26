import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.workspace)[':workspaceId']['reset-invite-code']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.workspace)[':workspaceId']['reset-invite-code']['$post']
>

// HOOK
export const useResetWorkspaceInviteCode = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspace[':workspaceId'][
        'reset-invite-code'
      ]['$post']({
        param
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: (data) => {
      toast.success('Código de invitación reseteado exitosamente', {
        description: 'El código de invitación ha sido reseteado.'
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
        error.message || 'Error al resetear el código de invitación'

      switch (true) {
        case errorMessage.includes('workspace_not_found'):
          toast.error('Espacio de trabajo no encontrado', {
            description:
              'No se pudo encontrar el espacio de trabajo que intentas resetear.'
          })
          break
        case errorMessage.includes('unauthorized'):
          toast.error('No autorizado', {
            description:
              'No tienes permisos para resetear el código de invitación.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error al resetear el código de invitación', {
            description:
              'Los datos proporcionados no son válidos. Por favor, verifica la información.'
          })
          break
        default:
          toast.error('Error al resetear el código de invitación', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
