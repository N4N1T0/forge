'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { ResetPasswordCard } from '@/features/auth/components/reset-password-card'
import { SignInCard } from '@/features/auth/components/sign-in-card'
import { SignUpCard } from '@/features/auth/components/sign-up-card'

function AuthContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'sign-in'

  const renderCard = () => {
    switch (tab) {
      case 'sign-up':
        return <SignUpCard />
      case 'reset':
        return <ResetPasswordCard />
      default:
        return <SignInCard />
    }
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left side - Image */}
      <div className='hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative z-10 flex flex-col justify-center items-center text-white p-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-center space-y-6'
          >
            <h1 className='text-5xl font-bold leading-tight'>
              Bienvenido a<br />
              <span className='text-orange-200'>Forge</span>
            </h1>
            <p className='text-xl text-orange-100 max-w-md'>
              La plataforma que transforma tus ideas en realidad digital
            </p>
            <div className='flex items-center justify-center space-x-2 text-orange-200'>
              <div className='w-2 h-2 bg-orange-200 rounded-full animate-pulse' />
              <div className='w-2 h-2 bg-orange-200 rounded-full animate-pulse delay-75' />
              <div className='w-2 h-2 bg-orange-200 rounded-full animate-pulse delay-150' />
            </div>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className='absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl' />
        <div className='absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl' />
        <div className='absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300/20 rounded-full blur-lg' />
      </div>

      {/* Right side - Auth Cards */}
      <div className='flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-50'>
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

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          Cargando...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  )
}
