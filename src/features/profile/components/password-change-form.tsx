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
import {
  changePasswordSchema,
  ChangePasswordSchema
} from '@/features/profile/schemas/profile-schemas'
import { useChangePassword } from '@/features/profile/server/use-change-password'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  email: string
}

export function PasswordChangeForm({ email }: Props) {
  // HOOKS
  const { mutate: changePassword, isPending } = useChangePassword()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // FORM
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })
  const { handleSubmit, control } = form

  // HANDLERS
  const onSubmit = (data: ChangePasswordSchema) => {
    changePassword(
      { json: data },
      {
        onSuccess: () => {
          form.reset()
        }
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* HIDDEN USER EMAIL ACCESSIBILITY */}
            <input
              type='text'
              hidden
              defaultValue={email}
              autoComplete='username'
            />

            {/* CURRENT PASSWORD */}
            <FormField
              control={control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        disabled={isPending}
                        className='pr-10'
                        autoComplete='current-password'
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className='size-4' />
                        ) : (
                          <Eye className='size-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NEW PASSWORD */}
            <FormField
              control={control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        disabled={isPending}
                        className='pr-10'
                        autoComplete='new-password'
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff className='size-4' />
                        ) : (
                          <Eye className='size-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONFIRM PASSWORD */}
            <FormField
              control={control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        disabled={isPending}
                        className='pr-10'
                        autoComplete='new-password'
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='size-4' />
                        ) : (
                          <Eye className='size-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Changing...' : 'Change password'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
