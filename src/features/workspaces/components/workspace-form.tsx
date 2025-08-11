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
import { createWorkspacesSchema } from '@/features/workspaces/schema'
import { useCreateWorkspace } from '@/features/workspaces/server/use-create-workspace'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

// TYPES
interface createWorkspacesFormProps {
  onCancel: () => void
}

const CreateWorkspacesForm = ({ onCancel }: createWorkspacesFormProps) => {
  // HOOKS
  const { mutate: createWorkspace, isPending } = useCreateWorkspace()
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof createWorkspacesSchema>>({
    resolver: zodResolver(createWorkspacesSchema),
    defaultValues: {
      name: '',
      image: ''
    }
  })

  // CONST
  const { control, handleSubmit, reset } = form

  // HANDLER
  const onSubmit = async (values: z.infer<typeof createWorkspacesSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : ''
    }
    createWorkspace(
      { form: finalValues },
      {
        onSuccess: () => {
          reset()
          onCancel()
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
    onCancel()
  }

  return (
    <Card className='w-full max-w-2xl mx-auto rounded-xl shadow-lg bg-white/50 backdrop-blur-sm'>
      <CardHeader className='space-y-2 pb-3'>
        <CardTitle className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
          Crear Espacio de Trabajo
        </CardTitle>
        <CardDescription className='text-base text-gray-600'>
          Crea un nuevo espacio de trabajo para empezar a colaborar con tu
          equipo.
        </CardDescription>
      </CardHeader>
      <Separator variant='dashed' className='bg-gray-200' />
      <CardContent className='pt-3'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-gray-700'>
                    Nombre del Espacio de Trabajo
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='name'
                      placeholder='Nombre del espacio de trabajo'
                      className='h-12 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200'
                      autoComplete='off'
                      disabled={isPending}
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
                <div className='bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300'>
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
                      <Avatar className='w-20 h-20 bg-gray-100'>
                        <AvatarFallback>
                          <ImageIcon className='w-10 h-10 text-gray-400' />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className='flex flex-col gap-y-2'>
                      <p className='text-sm font-medium text-gray-700'>
                        Icono del Workspace
                      </p>
                      <p className='text-sm text-gray-500'>
                        JPG, PNG, SVG o JPEG, máximo 1mb
                      </p>
                      <input
                        className='hidden'
                        accept='.jpg, .png, .jpeg, .svg'
                        ref={inputRef}
                        type='file'
                        disabled={isPending}
                        onChange={handleImageChange}
                      />
                      <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        onClick={() => inputRef.current?.click()}
                        disabled={isPending}
                        className='w-fit hover:bg-gray-100'
                      >
                        Subir Icono
                      </Button>
                    </div>
                  </div>
                  <FormMessage className='text-red-500 mt-1' />
                </div>
              )}
            />
            <div className='flex justify-end items-center w-full gap-3 pt-4'>
              <Button
                type='button'
                variant='secondary'
                size='lg'
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type='submit' size='lg' disabled={isPending}>
                {isPending ? 'Creando...' : 'Crear Espacio de Trabajo'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateWorkspacesForm
