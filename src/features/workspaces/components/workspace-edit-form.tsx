'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { updateWorkspaceSchema } from '@/features/workspaces/schema'
import { useUpdateWorkspace } from '@/features/workspaces/server/use-update-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { editWorkspacesFormProps } from '@/types/functions'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { useDeleteWorkspace } from '../server/use-delete-workspace'
import { useResetWorkspaceInviteCode } from '../server/use-reset-workspace-invite-code'

const EditWorkspacesForm = ({
  onCancel,
  initialValues
}: editWorkspacesFormProps) => {
  // HOOKS
  const router = useRouter()
  const { mutate: updateWorkspace, isPending: isUpdating } =
    useUpdateWorkspace()
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace()
  const { mutate: resetInviteCode, isPending: isResetting } =
    useResetWorkspaceInviteCode()
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, DeleteWorkspaceModal] = useConfirm(
    'Eliminar Espacio de Trabajo',
    '¿Estás seguro de eliminar este espacio de trabajo?',
    'destructive'
  )
  const [confirmResetInviteCode, ResetInviteCodeModal] = useConfirm(
    'Resetear Código de Invitación',
    '¿Estás seguro de resetear el código de invitación?',
    'destructive'
  )

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      image: initialValues?.imageUrl ?? '',
      name: initialValues?.name ?? ''
    }
  })

  // CONST
  const { control, handleSubmit, reset } = form
  const fullInviteCode = `${window.location.origin}/dashboard/workspace/${initialValues?.$id}/join?inviteCode=${initialValues?.inviteCode}`

  // HANDLER
  const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : ''
    }
    updateWorkspace(
      { form: finalValues, param: { workspaceId: initialValues?.$id } },
      {
        onSuccess: () => {
          reset()
          onCancel?.()
        }
      }
    )
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue('image', file)
    }
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

  const handleResetInviteCode = async () => {
    const ok = await confirmResetInviteCode()
    if (!ok) {
      return null
    }
    resetInviteCode(
      { param: { workspaceId: initialValues?.$id } },
      {
        onSuccess: () => {
          router.refresh()
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
    <div className='flex flex-col gap-y-4 max-w-3xl mx-auto'>
      {/* EDIT FORM */}
      <Card className='w-full mx-auto shadow-lg'>
        <CardHeader className=''>
          <div className='flex items-center flex-row gap-x-4'>
            <Button size='sm' variant='secondary' onClick={handleCancel}>
              <ArrowLeftIcon className='size-4' />
              Cancelar
            </Button>
            <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
              {initialValues?.name ?? 'Editar Espacio de Trabajo'}
            </CardTitle>
          </div>
          <CardDescription className='text-sm md:text-base text-muted-foreground'>
            Edita los detalles del espacio de trabajo.
          </CardDescription>
        </CardHeader>
        <Separator variant='dashed' className='bg-muted-foreground' />
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold text-muted-foreground'>
                      Nombre del Espacio de Trabajo
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='name'
                        placeholder='Nombre del espacio de trabajo'
                        className='h-12 focus:ring-2'
                        autoComplete='on'
                        disabled={isUpdating || isDeleting || isResetting}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='image'
                render={({ field }) => (
                  <div className='bg-input p-4 rounded-lg border border-dashed border-muted-foreground'>
                    <div className='flex items-center gap-x-6'>
                      {field.value ? (
                        <div className='relative w-20 h-20 rounded-lg overflow-hidden ring-2 ring-blue-500/20'>
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt='Imagen del Espacio de Trabajo'
                            fill
                            className='object-cover'
                          />
                        </div>
                      ) : (
                        <Avatar className='size-20 bg-muted-foreground'>
                          <AvatarFallback>
                            <ImageIcon className='w-10 h-10 text-muted-foreground' />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className='flex flex-col gap-y-2'>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Icono del Espacio de Trabajo
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          JPG, PNG, SVG o JPEG, máximo 1mb
                        </p>
                        <input
                          className='hidden'
                          accept='.jpg, .png, .jpeg, .svg'
                          ref={inputRef}
                          type='file'
                          disabled={isUpdating || isDeleting || isResetting}
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            type='button'
                            size='sm'
                            variant='destructive'
                            onClick={() => {
                              field.onChange(null)
                              if (inputRef.current) inputRef.current.value = ''
                            }}
                            disabled={isUpdating || isDeleting || isResetting}
                            className='w-fit'
                          >
                            Eliminar Icono
                          </Button>
                        ) : (
                          <Button
                            type='button'
                            size='sm'
                            variant='outline'
                            onClick={() => inputRef.current?.click()}
                            disabled={isUpdating || isDeleting || isResetting}
                            className='w-fit'
                          >
                            Subir Icono
                          </Button>
                        )}
                      </div>
                    </div>
                    <FormMessage className='text-red-500 mt-1' />
                  </div>
                )}
              />
              <div className='flex justify-end items-center gap-3 flex-wrap'>
                <Button
                  type='button'
                  variant='secondary'
                  size='lg'
                  onClick={handleCancel}
                  disabled={isUpdating || isDeleting || isResetting}
                  className='flex-1'
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  size='lg'
                  disabled={isUpdating || isDeleting || isResetting}
                  className='flex-1'
                >
                  {isUpdating ? 'Editando...' : 'Editar Espacio de Trabajo'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* RESET INVITE CODE ZONE */}
      <Card className='w-full max-h-[75vh] mx-auto shadow-lg'>
        <CardContent className='py-0'>
          <h3 className='text-2xl font-semibold'>Invitación</h3>
          <p className='text-sm text-muted-foreground my-3'>
            Puedes usar el siguiente código de invitación para invitar a nuevos
            miembros a este espacio de trabajo.
          </p>
          <div className='my-4'>
            <div className='flex items-center gap-x-2'>
              <Input disabled value={fullInviteCode} />
              <Button
                variant='secondary'
                size='sm'
                onClick={handleCopyInviteCode}
              >
                <CopyIcon className='size-4' />
              </Button>
            </div>
          </div>
          <Button
            variant='destructive'
            type='button'
            disabled={isDeleting || isUpdating || isResetting}
            onClick={handleResetInviteCode}
          >
            {isResetting ? 'Resetando...' : 'Resetear Código de Invitación'}
          </Button>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      <Card className='w-full max-h-[75vh] mx-auto shadow-lg'>
        <CardContent className='py-0'>
          <h3 className='text-2xl font-semibold'>Zona de Peligro</h3>
          <p className='text-sm text-muted-foreground my-3'>
            Eliminar este espacio de trabajo es irreversible, y eliminara todos
            los datos asociados a este espacio de trabajo.
          </p>
          <Button
            variant='destructive'
            type='button'
            disabled={isDeleting || isUpdating || isResetting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar Espacio de Trabajo'}
          </Button>
        </CardContent>
      </Card>

      {/* DELETE MODAL */}
      <DeleteWorkspaceModal />
      {/* RESET INVITE CODE MODAL */}
      <ResetInviteCodeModal />
    </div>
  )
}

export default EditWorkspacesForm
