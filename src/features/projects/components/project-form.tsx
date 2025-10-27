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
import {
  CreateProjectSchema,
  createProjectSchema
} from '@/features/projects/schema'
import { useCreateProject } from '@/features/projects/server/use-create-project'
import { useGetCurrentWorkspace } from '@/features/workspaces/hooks/use-workspace-id'
import { BaseFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

const CreateProjectForm = ({ onCancel }: BaseFormProps) => {
  // HOOKS
  const router = useRouter()
  const { workspace } = useGetCurrentWorkspace()
  const { mutate: createProject, isPending } = useCreateProject()
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      workspaceId: workspace?.$id || ''
    }
  })

  // CONST
  const { control, handleSubmit, reset } = form

  // HANDLER
  const onSubmit = async (values: CreateProjectSchema) => {
    const projectData = {
      ...values,
      workspaceId: workspace?.$id || ''
    }

    createProject(
      { form: projectData },
      {
        onSuccess: (data) => {
          reset()
          if (data.success) {
            router.push(
              `/dashboard/workspaces/${workspace?.$id}/projects/${data.data.$id}`
            )
          }
          onCancel?.()
        }
      }
    )
  }

  const handleCancel = () => {
    form.reset()
    onCancel?.()
  }

  return (
    <Card className='w-full max-w-2xl mx-auto shadow-lg overflow-y-auto'>
      <CardHeader className='space-y-2'>
        <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
          Create Project
        </CardTitle>
        <CardDescription className='text-sm md:text-base text-muted-foreground'>
          Create a new project to organize your work.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
                variant='secondary'
                size='lg'
                onClick={handleCancel}
                disabled={isPending}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                size='lg'
                disabled={isPending}
                className='flex-1'
              >
                {isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateProjectForm
