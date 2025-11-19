'use client'

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
import { Separator } from '@/components/ui/separator'
import { useForgotPassword } from '@/features/auth/hooks/use-forgot-password'
import {
  resetPasswordSchema,
  type ResetPasswordFormData
} from '@/features/auth/schemas/auth-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export const ForgotPasswordCard = () => {
  // HOOKS
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword()
  const [countdown, setCountdown] = useState(0)
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  // EFFECTS
  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [countdown])

  useEffect(() => {
    if (isSuccess) {
      setCountdown(60)
    }
  }, [isSuccess])

  // CONST
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form
  const isLoading = isPending || isSubmitting || countdown > 0

  // HANDLERS
  const onSubmit = (data: ResetPasswordFormData) => {
    forgotPassword({ json: data })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your email address and we will send you a link to reset your
          password
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
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {countdown > 0 ? `Resend in ${countdown}s` : 'Send Reset Link'}
            </Button>
          </form>
        </Form>

        <Separator />

        <CardFooter className='text-center text-sm text-muted-foreground space-y-2 flex-col'>
          {countdown > 0 ? (
            <Button type='button' variant='outline' className='w-full' asChild>
              <Link
                target='_blank'
                rel='noopener noreferrer'
                href='https://mail.google.com/mail/u/0/#search/from:noreply@appwrite.io'
              >
                Check your inbox
              </Link>
            </Button>
          ) : (
            <>
              <div>
                Remembered your password?{' '}
                <Link
                  href='/?tab=sign-in'
                  className='hover:underline font-medium text-primary'
                  disabled={isLoading}
                >
                  Sign In
                </Link>
              </div>
              <div>
                Don&apos;t have an account?{' '}
                <Link
                  href='/?tab=sign-up'
                  className='hover:underline font-medium text-primary'
                  disabled={isLoading}
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  )
}
