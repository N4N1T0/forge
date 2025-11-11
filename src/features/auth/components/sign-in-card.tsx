import { GitHubIcon, GoogleIcon } from '@/assets/icons'
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
import { Link } from '@/components/ui/link'
import { PasswordInput } from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  signInSchema,
  type SignInFormData
} from '@/features/auth/schemas/auth-schemas'
import { useSignIn } from '@/features/auth/server/use-sign-in'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

interface SignInCardProps {
  redirect?: string | null | undefined
}

export const SignInCard = ({ redirect }: SignInCardProps) => {
  // HOOKS
  const { mutate: signIn, isPending } = useSignIn()
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // CONST
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form
  const isLoading = isPending || isSubmitting

  // HANDLERS
  const onSubmit = (data: SignInFormData) => {
    signIn({ json: data, redirect })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold font-display text-primary uppercase'>
          Sign In
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account
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
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='you@example.com'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      autoComplete='email'
                      disabled={isLoading}
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
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      autoComplete='current-password'
                      disabled={isLoading}
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
              disabled={isLoading}
            >
              {isSubmitting ? <Spinner /> : null}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>

        <Separator className='my-6' />

        <div className='grid grid-cols-2 gap-3'>
          <Button variant='outline' disabled={isLoading}>
            <Image src={GoogleIcon} alt='Google Icon' className='size-5 mr-2' />
            Google
          </Button>
          <Button variant='outline' disabled={isLoading}>
            <Image src={GitHubIcon} alt='GitHub Icon' className='size-5 mr-2' />
            GitHub
          </Button>
        </div>

        <Separator />

        <CardFooter className='text-center text-sm text-muted-foreground space-y-2 flex-col'>
          <div>
            Don&apos;t have an account?{' '}
            <Link
              href={`/?tab=sign-up&redirect=${redirect}`}
              className='text-primary hover:underline font-medium'
              disabled={isLoading}
            >
              Sign up
            </Link>
          </div>
          <div>
            Forgot your password?{' '}
            <Link
              href='/?tab=forgot-password'
              className='text-primary hover:underline font-medium'
              disabled={isLoading}
            >
              Reset
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
