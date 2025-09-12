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
import { Icon, IconName, IconPicker } from '@/components/ui/icon-picker'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentMember } from '@/features/members/server/use-current-member'
import {
  CreateWorkspacesSchema,
  createWorkspacesSchema
} from '@/features/workspaces/schema'
import { useDeleteWorkspace } from '@/features/workspaces/server/use-delete-workspace'
import { useUpdateWorkspace } from '@/features/workspaces/server/use-update-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { checkIsOwner, generateSlug } from '@/lib/utils'
import { FormWithInitialValues } from '@/types'
import { Workspaces } from '@/types/appwrite'
import { zodResolver } from '@hookform/resolvers/zod'
import { LinkIcon, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const EditWorkspacesForm = ({
  onCancel,
  initialValues
}: FormWithInitialValues<Workspaces>) => {
  // HOOKS
  const router = useRouter()
  const { data: currentMember, isLoading } = useCurrentMember()
  const { mutate: updateWorkspace, isPending: isUpdating } =
    useUpdateWorkspace()
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace()
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, DeleteWorkspaceModal] = useConfirm(
    'Eliminar Espacio de Trabajo',
    '¿Estás seguro de eliminar este espacio de trabajo?',
    'destructive'
  )

  // FORM
  const form = useForm<CreateWorkspacesSchema>({
    resolver: zodResolver(createWorkspacesSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      icon: (initialValues?.icon as IconName) ?? 'anvil',
      slug: initialValues?.slug ?? generateSlug(initialValues?.name ?? '')
    }
  })

  // CONST
  const { control, handleSubmit, reset } = form
  const fullInviteCode = `${window.location.origin}/join?inviteCode=${form.watch('slug')}&workspaceId=${initialValues.$id}&icon=${form.watch('icon')}`

  // HANDLER
  const onSubmit = async (values: CreateWorkspacesSchema) => {
    updateWorkspace(
      { form: values, param: { workspaceId: initialValues?.$id } },
      {
        onSuccess: () => {
          reset()
          onCancel?.()
        }
      }
    )
  }

  const handleCancel = () => {
    form.reset()
    if (inputRef.current) inputRef.current.value = ''
    onCancel?.()
  }

  const handleDelete = async () => {
    const ok = await confirmDelete()
    if (!ok) {
      return null
    }

    deleteWorkspace(
      { param: { workspaceId: initialValues?.$id } },
      {
        onSuccess: () => {
          router.replace('/dashboard')
        }
      }
    )
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(fullInviteCode).then(() => {
      toast.success('Código de invitación copiado al portapapeles')
    })
  }

  return (
    <div className='flex flex-col gap-3 max-w-2xl mx-auto'>
      <Card className='w-full shadow-lg overflow-y-auto'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
            {initialValues?.name ?? 'Edit Workspace'}
          </CardTitle>
          <CardDescription className='text-sm md:text-base text-muted-foreground'>
            Edit the details of your workspace.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <fieldset className='flex gap-4 items-center w-full'>
                <FormField
                  control={control}
                  name='icon'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold text-muted-foreground'>
                        Icon
                      </FormLabel>
                      <IconPicker
                        value={field.value}
                        disabled={isUpdating || isDeleting}
                        onValueChange={(icon) => field.onChange(icon)}
                      >
                        <Button
                          variant='outline'
                          size='icon'
                          className='aspect-square size-12'
                          disabled={isUpdating || isDeleting}
                        >
                          {field.value ? (
                            <Icon name={field.value} />
                          ) : (
                            'Select Icon'
                          )}
                        </Button>
                      </IconPicker>
                      <FormMessage className='text-red-500' />
                    </FormItem>
                  )}
                />
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
                          type='name'
                          placeholder='Salamanders'
                          className='h-12 focus:ring-2 w-full'
                          autoComplete='on'
                          disabled={isUpdating || isDeleting}
                        />
                      </FormControl>
                      <FormMessage className='text-red-500' />
                    </FormItem>
                  )}
                />
              </fieldset>

              <FormField
                control={control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold text-muted-foreground'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Into the fires of battle, unto the anvil of war!'
                        className='h-12 focus:ring-2'
                        disabled={isUpdating || isDeleting}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold text-muted-foreground'>
                      Slug (Invite Link)
                    </FormLabel>
                    <FormControl>
                      <div className='flex gap-3 w-full'>
                        <div className='flex flex-1'>
                          <span className='border-input dark:bg-input/30 bg-transparent text-muted-foreground inline-flex items-center border px-3 text-xs'>
                            {`${origin}/join/`}
                          </span>
                          <Input
                            {...field}
                            className='h-12 focus:ring-2'
                            placeholder={
                              initialValues?.slug ??
                              (generateSlug(form.watch('name')) ||
                                'salamanders')
                            }
                            type='text'
                            disabled={isUpdating || isDeleting}
                          />
                        </div>
                        <Button
                          type='button'
                          variant='secondary'
                          className='h-12 aspect-square w-auto'
                          onClick={handleCopyInviteCode}
                          disabled={isUpdating || isDeleting}
                        >
                          <LinkIcon />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <Separator />

              <div className='flex justify-end items-center gap-3 flex-wrap'>
                <Button
                  type='button'
                  variant='secondary'
                  size='lg'
                  onClick={handleCancel}
                  disabled={isUpdating || isDeleting}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  size='lg'
                  disabled={isUpdating || isDeleting}
                  className='flex-1'
                >
                  {isUpdating ? 'Updating...' : 'Update Workspace'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      {checkIsOwner(currentMember, initialValues) && !isLoading && (
        <>
          {/* DELETE CARD */}
          <Card className='max-w-2xl border-destructive'>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Deleting a workspace is irreversible and will remove all
                associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type='button'
                variant='destructive'
                onClick={handleDelete}
                disabled={isDeleting || isUpdating}
              >
                {isDeleting ? (
                  <>
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                    Deleting...
                  </>
                ) : (
                  'Delete Workspace'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* DELETE MODAL */}
          <DeleteWorkspaceModal />
        </>
      )}
    </div>
  )
}

export default EditWorkspacesForm
