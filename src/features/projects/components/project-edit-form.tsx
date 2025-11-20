'use client'

import { RichTextEditor } from '@/components/tiptap/rich-text-editor'
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
import {
  createProjectSchema,
  CreateProjectSchema,
  useUpdateProject
} from '@/features/projects'
import { useGetCurrentWorkspace } from '@/features/workspaces'
import { FormWithInitialValues } from '@/types'
import { Projects } from '@/types/appwrite'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'

export const EditarProyectoForm = ({
  onCancel,
  initialValues
}: FormWithInitialValues<Projects>) => {
  // HOOKS
  const { workspace } = useGetCurrentWorkspace()
  const { mutate: actualizarProyecto, isPending } = useUpdateProject()
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: initialValues?.name || '',
      shortcut: initialValues?.shortcut || '',
      description: '',
      workspaceId: workspace?.$id || ''
    }
  })

  // RENDER
  if (!initialValues) {
    return null
  }

  // CONST
  const { control, handleSubmit, reset } = form

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

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  return (
    <Card className='size-full overflow-y-auto pt-3 pb-0 gap-4'>
      <CardHeader className='gap-0 flex justify-between items-center'>
        <div>
          <CardTitle className='text-2xl font-bold text-primary'>
            Edit Project
          </CardTitle>
          <CardDescription className='sr-only'>
            Edit the project details.
          </CardDescription>
        </div>

        {/* CLOSE BTN */}
        <div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={handleCancel}
          >
            <X />
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(alEnviar)} className='space-y-6'>
            <fieldset className='flex gap-4 items-center w-full'>
              {/* NAME FIELD */}
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

              {/* SHORCUT */}
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

            {/* DESCRIPTION */}
            <FormField
              control={control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-muted-foreground'>
                    Description
                  </FormLabel>
                  <p className='text-xs text-muted-foreground'>
                    This description will help power upcoming AI features.
                  </p>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <Separator />

            <div className='flex justify-end items-center gap-3 flex-wrap'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
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
