import { client } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<(typeof client.api.workspace)['$post']>
type RequestType = InferRequestType<(typeof client.api.workspace)['$post']>

// HOOK
export const useCreateWorkspace = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.workspace['$post'](form)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Workspace created successfully', {
        description: 'Your new workspace has been created.'
      })
    },
    onError: (error) => {
      const errorMessage =
        error.message || 'Error al crear el espacio de trabajo'

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
