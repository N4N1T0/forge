'use client'

import { GitHubIcon, GoogleIcon } from '@/assets/icons'
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
  signUpSchema,
  type SignUpFormData
} from '@/features/auth/schemas/auth-schemas'
import { useSignUp } from '@/features/auth/server/use-sign-up'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { PasswordInput } from './password-input'

export const SignUpCard = () => {
  // HOOKS
  const { mutate, isPending } = useSignUp()
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // CONST
  const { control, handleSubmit } = form

  // HANDLERS
  const onSubmit = (data: SignUpFormData) => {
    mutate({ json: data })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold text-primary font-display uppercase'>
          Crear Cuenta
        </CardTitle>
        <CardDescription>
          Completa los campos para crear tu nueva cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Nombre completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='Tu nombre completo'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isPending}
                      autoComplete='name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isPending}
                      autoComplete='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isPending}
                      autoComplete='new-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Confirmar contraseña
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isPending}
                      autoComplete='new-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              size='lg'
              disabled={isPending}
            >
              {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </Form>

        <Separator variant='dashed' />

        <div className='grid grid-cols-2 gap-3'>
          <Button variant='outline' disabled={isPending}>
            <Image src={GoogleIcon} alt='Google Icon' className='size-5 mr-2' />
            Google
          </Button>
          <Button variant='outline' disabled={isPending}>
            <Image src={GitHubIcon} alt='GitHub Icon' className='size-5 mr-2' />
            GitHub
          </Button>
        </div>

        <Separator variant='dashed' />

        <div className='text-center text-sm text-muted-foreground'>
          ¿Ya tienes una cuenta?{' '}
          <Link
            href='/?tab=sign-in'
            className='text-orange-600 hover:underline font-medium'
          >
            Iniciar Sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
