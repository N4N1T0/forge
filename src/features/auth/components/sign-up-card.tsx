'use client'

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
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
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

interface SignUpCardProps {
  redirect?: string | null | undefined
}

export const SignUpCard = ({ redirect }: SignUpCardProps) => {
  // HOOKS
  const { mutate: signUp, isPending } = useSignUp()
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
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form
  const isLoading = isPending || isSubmitting

  // HANDLERS
  const onSubmit = (data: SignUpFormData) => {
    signUp({ json: data, redirect })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold text-primary font-display uppercase'>
          Create Account
        </CardTitle>
        <CardDescription>
          Complete the fields to create your new account
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
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='Your full name'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isLoading}
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
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='you@example.com'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isLoading}
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
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isLoading}
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
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      disabled={isLoading}
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
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : null}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <Separator />

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
          Already have an account?{' '}
          <Link
            href={`/?tab=sign-in&redirect=${redirect}`}
            className='text-primary hover:underline font-medium'
          >
            Sign In
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
