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
import { createWorkspacesSchema } from '@/features/workspaces/schema'
import { useCreateWorkspace } from '@/features/workspaces/server/use-create-workspace'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

// TYPES
interface createWorkspacesFormProps {
  onCancel: () => void
}

const CreateWorkspacesForm = ({ onCancel }: createWorkspacesFormProps) => {
  // HOOKS
  const { mutate: createWorkspace, isPending } = useCreateWorkspace()
  const form = useForm<z.infer<typeof createWorkspacesSchema>>({
    resolver: zodResolver(createWorkspacesSchema),
    defaultValues: {
      name: ''
    }
  })

  // CONST
  const { control, handleSubmit } = form

  // HANDLER
  const onSubmit = async (values: z.infer<typeof createWorkspacesSchema>) => {
    createWorkspace({ json: values })
    onCancel()
  }

  return (
    <Card className='size-full border-none shadow-none'>
      <CardHeader className='flex p-7'>
        <CardTitle className='text-2xl font-bold'>Create Workspace</CardTitle>
        <CardDescription>
          Create a new workspace to start collaborating with your team.
        </CardDescription>
      </CardHeader>
      <Separator variant='dashed' />
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='name'
                      placeholder='workspace Name'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      autoComplete='email'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-between items-center'>
              <Button
                type='button'
                variant='secondary'
                size='lg'
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' size='lg' disabled={isPending}>
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateWorkspacesForm
