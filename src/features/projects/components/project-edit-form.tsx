'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  createProjectSchema,
  CreateProjectSchema
} from '@/features/projects/schema'
import { useUpdateProject } from '@/features/projects/server/use-update-project'
import { useGetCurrentWorkspace } from '@/features/workspaces/hooks/use-workspace-id'
import { FormWithInitialValues } from '@/types'
import { Projects } from '@/types/appwrite'

const EditarProyectoForm = ({
  onCancel,
  initialValues
}: FormWithInitialValues<Projects>) => {
  // HOOKS
  const { workspace } = useGetCurrentWorkspace()
  const { mutate: actualizarProyecto, isPending } = useUpdateProject()
  const formulario = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: initialValues?.name || '',
      shortcut: initialValues?.shortcut || '',
      workspaceId: workspace?.$id || ''
    }
  })

  // RENDER
  if (!initialValues) {
    return null
  }

  // CONST
  const { control, handleSubmit } = formulario

  // HANDLERS
  const alEnviar = async (valores: CreateProjectSchema) => {
    const datosProyecto = {
      ...valores,
      workspaceId: workspace?.$id || ''
    }

    actualizarProyecto(
      {
        form: datosProyecto,
        param: { projectId: initialValues.$id }
      },
      {
        onSuccess: () => {
          onCancel?.()
        }
      }
    )
  }

  const alCancelar = () => {
    onCancel?.()
  }

  return (
    <Card className='w-full max-w-2xl mx-auto shadow-lg overflow-y-auto'>
      <CardHeader className='space-y-2'>
        <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
          Edit Project
        </CardTitle>
        <CardDescription className='text-sm md:text-base text-muted-foreground'>
          Edit the details of your project.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...formulario}>
          <form onSubmit={handleSubmit(alEnviar)} className='space-y-6'>
            <fieldset className='flex gap-4 items-center w-full'>
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-sm font-semibold text-muted-foreground'>
                      Name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='text'
                        placeholder='Vulcan Journey'
                        className='h-12 focus:ring-2 w-full'
                        autoComplete='on'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='shortcut'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold text-muted-foreground'>
                      Shortcut
                    </FormLabel>
                    <FormControl>
                      <div className='flex'>
                        <span className='border-input dark:bg-input/30 bg-transparent text-muted-foreground inline-flex items-center border px-3 text-xs'>
                          ⌘
                        </span>
                        <Input
                          {...field}
                          className='h-12 focus:ring-2 max-w-12 aspect-square w-auto'
                          placeholder='F'
                          type='text'
                          maxLength={1}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
            </fieldset>

            <Separator />

            <div className='flex justify-end items-center gap-3 flex-wrap'>
              <Button
                type='button'
                variant='outline'
                onClick={alCancelar}
                className='flex-1'
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' className='flex-1' disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Project'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default EditarProyectoForm
