import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

// TYPES
type ResponseType = InferResponseType<(typeof client.api.project)['$post']>
type RequestType = InferRequestType<(typeof client.api.project)['$post']>

// HOOK
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.project['$post']({ form })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.data)
      }

      return data
    },
    onSuccess: () => {
      toast.success('Proyecto creado exitosamente', {
        description: 'Tu nuevo proyecto ha sido creado.'
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      const errorMessage = error.message || 'Error al crear el proyecto'

      switch (true) {
        case errorMessage.includes('project_name_taken'):
          toast.error('Nombre de proyecto ya en uso', {
            description:
              'Por favor, elige un nombre diferente para tu proyecto.'
          })
          break
        case errorMessage.includes('project_limit_reached'):
          toast.error('Límite de proyectos alcanzado', {
            description:
              'Has alcanzado el número máximo de proyectos permitidos.'
          })
          break
        case errorMessage.includes('invalid_project_name'):
          toast.error('Nombre de proyecto inválido', {
            description:
              'El nombre del proyecto contiene caracteres inválidos o es demasiado corto.'
          })
          break
        case errorMessage.includes('ZodError'):
          toast.error('Error al crear el proyecto', {
            description:
              'Los datos proporcionados no son válidos. Por favor, verifica la información.'
          })
          break
        default:
          toast.error('Error al crear el proyecto', {
            description: errorMessage
          })
      }
    }
  })

  return mutation
}
