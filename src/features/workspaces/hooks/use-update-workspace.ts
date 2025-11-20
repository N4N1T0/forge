import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<
  (typeof client.api.workspace)[':workspaceId']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.workspace)[':workspaceId']['$patch']
>

// HOOK
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspace[':workspaceId']['$patch']({
        form,
        param
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: (data) => {
      toast.success('Espacio de trabajo actualizado exitosamente', {
        description: 'Tu espacio de trabajo ha sido actualizado.'
      })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      if (data.success)
        queryClient.invalidateQueries({
          queryKey: ['workspaces', data.data.$id]
        })
    },
    onError: (error) => {
      const errorMessage =
        error.message || 'Error al actualizar el espacio de trabajo'

      switch (true) {
        case errorMessage.includes('workspace_name_taken'):
          toast.error('Nombre de espacio de trabajo ya en uso', {
            description:
              'Por favor, elige un nombre diferente para tu espacio de trabajo.'
          })
          break
        case errorMessage.includes('workspace_limit_reached'):
          toast.error('Límite de espacios de trabajo alcanzado', {
            description:
              'Has alcanzado el número máximo de espacios de trabajo permitidos.'
          })
          break
        case errorMessage.includes('invalid_workspace_name'):
          toast.error('Nombre de espacio de trabajo inválido', {
            description:
              'El nombre del espacio de trabajo contiene caracteres inválidos o es demasiado corto.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error al crear el espacio de trabajo', {
            description:
              'Los datos proporcionados no son válidos. Por favor, verifica la información.'
          })
          break
        default:
          toast.error('Error al crear el espacio de trabajo', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
