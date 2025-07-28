'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { AuthImage } from '@/assets/images'
import { ResetPasswordCard } from '@/features/auth/components/reset-password-card'
import { SignInCard } from '@/features/auth/components/sign-in-card'
import { SignUpCard } from '@/features/auth/components/sign-up-card'
import Image from 'next/image'

function AuthContent() {
  // STATE
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'sign-in'

  // RENDER
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
      <div className='hidden lg:flex lg:w-1/2 relative'>
        <Image src={AuthImage} alt='Auth Image' className='w-full h-full object-cover' />
        
        {/* Logo in top-left corner */}
        <div className='absolute top-6 left-6 z-10'>
          <Image 
            src='/forge-logo.png' 
            alt='Forge Logo' 
            width={60} 
            height={60}
            className='drop-shadow-lg'
          />
        </div>
        
        {/* Gradient backdrop with text at bottom */}
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-8'>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='text-white text-4xl font-bold tracking-wide'
          >
            Bienvenidos a la Forja
          </motion.h1>
        </div>
      </div>

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
