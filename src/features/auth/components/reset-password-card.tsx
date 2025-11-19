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
import { Link } from '@/components/ui/link'
import { PasswordInput } from '@/components/ui/password-input'
import { Spinner } from '@/components/ui/spinner'
import { useResetPassword } from '@/features/auth/hooks/use-reset-password'
import {
  UpdatePasswordFormData,
  updatePasswordSchema
} from '@/features/auth/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

// TYPES
export type ResetPasswordCardProps = {
  userId: string
  secret: string
}

export const ResetPasswordCard = ({
  userId,
  secret
}: ResetPasswordCardProps) => {
  // HOOKS
  const { mutate: resetPassword, isPending } = useResetPassword()
  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      secret,
      userId
    }
  })

  // CONST
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form
  const isParamsMissing = !userId || !secret
  const isLoading = isPending || isSubmitting || isParamsMissing

  // HANDLERS
  const onSubmit = (data: UpdatePasswordFormData) => {
    if (isParamsMissing) return
    resetPassword({
      json: {
        userId,
        secret,
        password: data.password,
        confirmPassword: data.confirmPassword
      }
    })
  }

  // ERROR
  if (isParamsMissing) {
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
            Invalid Link
          </CardTitle>
          <CardDescription>
            The recovery link is invalid or has expired. Please request a new
            password reset link.
          </CardDescription>
        </CardHeader>
        <CardFooter className='text-center'>
          <Button size='lg' className='w-full' asChild>
            <Link href='/?tab=forgot-password'>
              Request new password reset link
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter and confirm your new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    New password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                      autoComplete='new-password'
                      disabled={isLoading}
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
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder='••••••••'
                      className='h-11 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                      autoComplete='new-password'
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? <Spinner /> : null}
              {isLoading ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
