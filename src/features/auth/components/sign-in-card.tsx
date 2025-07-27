import { GitHubIcon, GoogleIcon } from '@/app/assets/icons'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { PasswordInput } from './password-input'
import { signInSchema, type SignInFormData } from './schemas/auth-schemas'

export const SignInCard = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form

  const onSubmit = (data: SignInFormData) => {
    console.log('Sign in data:', data)
    // Handle sign in logic here
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold font-display text-primary uppercase'>
          Iniciar Sesión
        </CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
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
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      autoComplete='email'
                      disabled={isSubmitting}
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
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      autoComplete='current-password'
                      disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Inicia Sesión'}
            </Button>
          </form>
        </Form>

        <Separator variant='dashed' className='my-6' />

        <div className='grid grid-cols-2 gap-3'>
          <Button variant='outline' disabled={isSubmitting}>
            <Image src={GoogleIcon} alt='Google Icon' className='size-5 mr-2' />
            Google
          </Button>
          <Button variant='outline' disabled={isSubmitting}>
            <Image src={GitHubIcon} alt='GitHub Icon' className='size-5 mr-2' />
            GitHub
          </Button>
        </div>

        <Separator variant='dashed' />

        <CardFooter className='text-center text-sm text-muted-foreground space-y-2 flex-col'>
          <div>
            ¿No tienes una cuenta?{' '}
            <Link
              href='/auth?tab=sign-up'
              className='text-orange-600 hover:underline font-medium'
            >
              Regístrate
            </Link>
          </div>
          <div>
            ¿Olvidaste tu contraseña?{' '}
            <Link
              href='/auth?tab=reset'
              className='text-orange-600 hover:underline font-medium'
            >
              Restablecer
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
