'use client'

import { DynamicIconPoster } from '@/features/auth/components/dynamic-icon-poster'
import { ForgotPasswordCard } from '@/features/auth/components/forgot-password-card'
import { OtpVerificationCard } from '@/features/auth/components/otp-verification-card'
import { ResetPasswordCard } from '@/features/auth/components/reset-password-card'
import { SignInCard } from '@/features/auth/components/sign-in-card'
import { SignUpCard } from '@/features/auth/components/sign-up-card'
import { IconName } from 'lucide-react/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthContent() {
  // STATE
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'sign-in'
  const workspaceId = searchParams.get('workspaceId')
  const icon = searchParams.get('icon')
  const inviteCode = searchParams.get('inviteCode')
  const userId = searchParams.get('userId') || ''
  const secret = searchParams.get('secret') || ''
  const redirect = `/join?workspaceId=${workspaceId}&icon=${icon}&inviteCode=${inviteCode}&userId=${userId}&secret=${secret}`

  // RENDER
  const renderCard = () => {
    switch (tab) {
      case 'sign-up':
        return <SignUpCard redirect={redirect} />
      case 'forgot-password':
        return <ForgotPasswordCard />
      case 'reset-password':
        return <ResetPasswordCard userId={userId} secret={secret} />
      case 'verify-otp':
        return <OtpVerificationCard userId={userId} />
      default:
        return <SignInCard redirect={redirect} />
    }
  }

  return (
    <div className='min-h-screen flex'>
      <DynamicIconPoster icon={icon as IconName} />

      <div className='flex-1 flex items-center justify-center p-4 lg:p-8 bg-background'>
        <div className='w-full max-w-md'>{renderCard()}</div>
      </div>
    </div>
  )
}

export default function AuthHomePage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-'>
          Cargando...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  )
}
