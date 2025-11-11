'use client'

import { RichTextEditor } from '@/components/tiptap/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { status } from '@/data'
import { createTaskSchema, CreateTaskSchema } from '@/features/tasks/schema'
import { useCreateTask } from '@/features/tasks/server/use-create-task'
import { cn } from '@/lib/utils'
import { BaseFormProps, FormattedMembers } from '@/types'
import { Status, Workspaces } from '@/types/appwrite'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader, X } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { ModalTaskWrapper } from '../modal-task-wrapper'

interface TaskCreateFormProps extends BaseFormProps {
  projectId: string
}

export const TaskCreateForm = ({ onCancel }: BaseFormProps) => {
  return (
    <ModalTaskWrapper>
      {({ workspace, members, isLoading, projectId }) => (
        <TaskCreateFormContent
          onCancel={onCancel}
          projectId={projectId}
          workspace={workspace}
          members={members}
          isLoading={isLoading}
        />
      )}
    </ModalTaskWrapper>
  )
}

interface TaskCreateFormContentProps extends TaskCreateFormProps {
  workspace: Partial<Workspaces> | undefined
  members: FormattedMembers
  isLoading: boolean
}

const TaskCreateFormContent = ({
  onCancel,
  projectId,
  workspace,
  members,
  isLoading
}: TaskCreateFormContentProps) => {
  // HOOKS
  const { mutate: createTask, isPending } = useCreateTask()

  // FORM
  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: '',
      description: '',
      status: Status.BACKLOG,
      workspaceId: workspace?.$id || '',
      projectId,
      assigneeId: '',
      dueDate: ''
    }
  })
  const { handleSubmit } = form

  // HANDLERS
  const handleCreateTaskSubmit = useCallback(
    (values: CreateTaskSchema) => {
      const finalValues = {
        ...values,
        workspaceId: workspace?.$id || ''
      }

      createTask(
        { json: finalValues },
        {
          onSuccess: () => {
            form.reset()
            onCancel?.()
          }
        }
      )
    },
    [createTask, form, onCancel, workspace?.$id]
  )

  const handleCancel = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  return (
    <Card className='size-full overflow-y-auto pt-3 pb-0 gap-4'>
      <CardHeader className='gap-0 flex justify-between items-center'>
        <div>
          <CardTitle className='text-2xl font-bold text-primary'>
            Create a new task
          </CardTitle>
          <CardDescription className='sr-only'>
            Create a new task to keep track of your work.
          </CardDescription>
        </div>

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
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleCreateTaskSubmit)}
          className='flex-1'
        >
          <CardContent className='space-y-4'>
            {/* NAME & STATUS */}
            <fieldset className='w-full flex gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='Enter task name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='min-w-2/6'>
                    <FormLabel>Status</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {status.map(({ value, label, color }) => (
                          <SelectItem key={value} value={value}>
                            <svg
                              width='6'
                              height='6'
                              fill='currentColor'
                              viewBox='0 0 6 6'
                              xmlns='http://www.w3.org/2000/svg'
                              aria-hidden='true'
                              style={{
                                color: color
                              }}
                            >
                              <circle cx='3' cy='3' r='3' />
                            </svg>
                            <span className='truncate'>{label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='h-full'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ASSIGNEE  & DUE DATE */}
            <fieldset className='w-full flex gap-6'>
              <FormField
                control={form.control}
                name='assigneeId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select an assignee' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading && (
                          <SelectItem
                            key='loading'
                            value='loading'
                            disabled={isLoading}
                          >
                            <Loader className='animate-spin' />
                          </SelectItem>
                        )}
                        {members &&
                          members
                            ?.filter((member) => member !== null)
                            .map(({ $id, name }) => (
                              <SelectItem key={$id} value={$id}>
                                <span
                                  data-square
                                  className='bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium'
                                  aria-hidden='true'
                                >
                                  {name.charAt(0)}
                                </span>
                                <span className='truncate'>{name}</span>
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={isPending}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          disabled={(date) =>
                            date < new Date() || date < new Date('1900-01-01')
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </CardContent>

          <Separator className='my-4' />

          <CardFooter className='flex justify-end items-center gap-3 flex-wrap mt-auto'>
            <Button
              type='button'
              size='lg'
              variant='secondary'
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
              {isPending ? 'Creating...' : 'Create Task'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
