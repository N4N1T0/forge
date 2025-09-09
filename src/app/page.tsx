'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { DynamicIconPoster } from '@/features/auth/components/dynamic-icon-poster'
import { ResetPasswordCard } from '@/features/auth/components/reset-password-card'
import { SignInCard } from '@/features/auth/components/sign-in-card'
import { SignUpCard } from '@/features/auth/components/sign-up-card'
import { IconName } from 'lucide-react/dynamic'

function AuthContent() {
  // STATE
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'sign-in'
  const workspaceId = searchParams.get('workspaceId')
  const icon = searchParams.get('icon')
  const inviteCode = searchParams.get('inviteCode')
  const redirect = `/join?workspaceId=${workspaceId}&icon=${icon}&inviteCode=${inviteCode}`

  // RENDER
  const renderCard = () => {
    switch (tab) {
      case 'sign-up':
        return <SignUpCard redirect={redirect} />
      case 'reset':
        return <ResetPasswordCard />
      default:
        return <SignInCard redirect={redirect} />
    }
  }

  return (
    <div className='min-h-screen flex'>
      <DynamicIconPoster icon={icon as IconName} />

      <div className='flex-1 flex items-center justify-center p-4 lg:p-8 bg-background'>
        <div className='w-full max-w-md'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {renderCard()}
            </motion.div>
          </AnimatePresence>
        </div>
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
