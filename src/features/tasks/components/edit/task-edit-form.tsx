'use client'

import { RichTextEditor } from '@/components/tiptap/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { useEditTask } from '@/features/tasks/server/use-edit-task'
import { cn } from '@/lib/utils'
import { BaseFormProps, FormattedMembers } from '@/types'
import { Tasks, Workspaces } from '@/types/appwrite'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ModalTaskWrapper } from '../modal-task-wrapper'

interface TaskEditFormProps extends BaseFormProps {
  task: Tasks
}

export const TaskEditForm = ({ onCancel, task }: TaskEditFormProps) => {
  return (
    <ModalTaskWrapper>
      {({ workspace, members, isLoading }) => (
        <TaskEditFormContent
          onCancel={onCancel}
          task={task}
          workspace={workspace}
          members={members}
          isLoading={isLoading}
        />
      )}
    </ModalTaskWrapper>
  )
}

interface TaskEditFormContentProps extends TaskEditFormProps {
  workspace: Partial<Workspaces> | undefined
  members: FormattedMembers
  isLoading: boolean
}

const TaskEditFormContent = ({
  onCancel,
  task,
  workspace,
  members,
  isLoading
}: TaskEditFormContentProps) => {
  // HOOKS
  const { mutate: editTask, isPending } = useEditTask()

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: task.name,
      description: task.description || '',
      status: task.status,
      workspaceId: workspace?.$id || '',
      projectId: task.projectId,
      assigneeId: task.assigneeId || '',
      dueDate: task.dueDate || ''
    }
  })

  // Update form values when task changes
  useEffect(() => {
    form.reset({
      name: task.name,
      description: task.description || '',
      status: task.status,
      workspaceId: workspace?.$id || '',
      projectId: task.projectId,
      assigneeId: task.assigneeId || '',
      dueDate: task.dueDate || ''
    })
  }, [task, workspace?.$id, form])

  // HANDLERS
  const handleSubmit = useCallback(
    (values: CreateTaskSchema) => {
      const finalValues = {
        ...values,
        workspaceId: workspace?.$id || ''
      }

      editTask(
        {
          json: finalValues,
          param: { taskId: task.$id }
        },
        {
          onSuccess: () => {
            onCancel?.()
          }
        }
      )
    },
    [editTask, onCancel, workspace?.$id, task.$id]
  )

  const handleCancel = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  return (
    <Card className='w-full max-w-2xl mx-auto shadow-lg overflow-y-auto'>
      <CardHeader className='gap-0'>
        <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
          Edit task
        </CardTitle>
        <CardDescription className='text-sm md:text-base text-muted-foreground'>
          Update the task details.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
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
              name='description'
              render={({ field }) => (
                <FormItem>
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

            <fieldset className='w-full flex gap-6'>
              <FormField
                control={form.control}
                name='assigneeId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl className='flex-1'>
                        <SelectTrigger>
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
                name='status'
                render={({ field }) => (
                  <FormItem>
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

            <FormField
              control={form.control}
              name='dueDate'
              render={({ field }) => (
                <FormItem>
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
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

            <Separator />

            <div className='flex justify-end items-center gap-3 flex-wrap'>
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
                {isPending ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
