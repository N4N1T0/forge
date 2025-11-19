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
  FormMessage
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { Link } from '@/components/ui/link'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useOtpVerification } from '@/features/auth/hooks/use-otp-verification'
import { OtpFormData, otpSchema } from '@/features/auth/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

// TYPES
export interface OtpVerificationCardProps {
  userId: string
}

export const OtpVerificationCard = ({ userId }: OtpVerificationCardProps) => {
  // HOOKS
  const { mutate: verifyOtp, isPending } = useOtpVerification()
  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      userId,
      secret: ''
    }
  })

  // CONST
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form
  const isUserIdMissing = !userId
  const isLoading = isPending || isSubmitting || isUserIdMissing

  // HANDLERS
  const onSubmit = (data: OtpFormData) => {
    verifyOtp({
      json: data
    })
  }

  // ERROR
  if (isUserIdMissing) {
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
            Invalid Credentials
          </CardTitle>
          <CardDescription>
            Please enter the verification code sent to your email.
          </CardDescription>
        </CardHeader>
        <CardFooter className='text-center'>
          <Button size='lg' className='w-full' asChild>
            <Link href='/?tab=sign-in'>Reload the Sign In Workflow</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
          OTP Verification
        </CardTitle>
        <CardDescription>
          Enter the verification code sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='secret'
              render={({ field }) => (
                <FormItem className='w-full flex justify-center'>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className='[&_div]:size-12'>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={isLoading}
              size='lg'
            >
              {isSubmitting ? <Spinner /> : null}
              {isLoading ? 'Verifying...' : 'Verify code'}
            </Button>
          </form>
        </Form>

        <Separator />

        <CardFooter className='text-center text-sm text-muted-foreground space-y-2 flex-col'>
          <Button
            type='button'
            variant='outline'
            className='w-full'
            asChild
            size='sm'
          >
            <Link
              target='_blank'
              rel='noopener noreferrer'
              href='https://mail.google.com/mail/u/0/#search/from:noreply@appwrite.io'
              disabled={isLoading}
            >
              Check your inbox
            </Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
