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
import { useMfaChallenge } from '@/features/auth/hooks/use-mfa-challenge'
import { useMfaVerification } from '@/features/auth/hooks/use-mfa-verification'
import {
  MfaChallengeFormData,
  mfaChallengeSchema
} from '@/features/auth/schemas/auth-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'

export const MfaVerificationCard = () => {
  // HOOKS
  const { data: startChallenge, isPending: isChallengeLoading } =
    useMfaChallenge()
  const { mutate: verifyMfa, isPending: isVerificationLoading } =
    useMfaVerification()
  const form = useForm<MfaChallengeFormData>({
    resolver: zodResolver(mfaChallengeSchema),
    defaultValues: {
      challengeId: startChallenge?.data || '',
      otp: ''
    }
  })

  // CONST
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = form
  const isLoading = isSubmitting || isVerificationLoading

  // HANDLERS
  const onSubmit = (data: MfaChallengeFormData) => {
    verifyMfa({ json: data })
  }

  // RENDER
  if (isChallengeLoading) {
    return (
      <Card>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
            Loading
          </CardTitle>
          <CardDescription>
            Please wait while we start the MFA Challenge.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center text-sm text-muted-foreground space-y-2 flex-col'>
          <Spinner className='size-8' />
        </CardContent>
      </Card>
    )
  }

  if (!startChallenge || startChallenge.success === false) {
    return (
      <Card>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-bold font-display uppercase text-primary'>
            Error
          </CardTitle>
          <CardDescription>
            The MFA Challenge could not be started. Please try again.
          </CardDescription>
        </CardHeader>
        <CardFooter className='text-center text-sm text-muted-foreground space-y-2 flex-col'>
          <Button
            type='button'
            variant='outline'
            className='w-full'
            asChild
            size='sm'
          >
            <Link href='/' disabled={isLoading}>
              Back to Sign In
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
          MFA Verification
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={control}
              name='otp'
              render={({ field }) => (
                <FormItem className='w-full flex justify-center ite'>
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
          El challenge termina el
          <time dateTime={startChallenge?.expires}>
            {format(startChallenge?.expires, 'yyyy-MM-dd HH:mm:ss')}
          </time>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
