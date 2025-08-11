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
  resetPasswordSchema,
  type ResetPasswordFormData
} from '@/features/auth/schemas/auth-schemas'
import { useResetPassword } from '@/features/auth/server/use-reset-password'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

export const ResetPasswordCard = () => {
  const { mutate } = useResetPassword()
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate({ json: data })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
          Restablecer Contraseña
        </CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='tu@ejemplo.com'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting
                ? 'Enviando enlace...'
                : 'Enviar Enlace de Restablecimiento'}
            </Button>
          </form>
        </Form>

        <Separator variant='dashed' />

        <div className='text-center text-sm text-muted-foreground space-y-2'>
          <div>
            ¿Recordaste tu contraseña?{' '}
            <Link
              href='/?tab=sign-in'
              className='text-orange-600 hover:underline font-medium'
            >
              Iniciar Sesión
            </Link>
          </div>
          <div>
            ¿No tienes una cuenta?{' '}
            <Link
              href='/?tab=sign-up'
              className='text-orange-600 hover:underline font-medium'
            >
              Regístrate
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
