'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import ResponsiveModal from '@/components/ui/modal/responsive-modal'
import { useState } from 'react'

/**
 * CUSTOM HOOK FOR CREATING CONFIRMATION DIALOGS
 *
 * @param {string} title - THE TITLE TO DISPLAY IN THE CONFIRMATION DIALOG
 * @param {string} message - THE MESSAGE TO DISPLAY IN THE CONFIRMATION DIALOG
 * @param {ButtonProps['variant']} variant - THE VARIANT OF THE CONFIRM BUTTON (DEFAULT: 'default')
 * @returns {[() => Promise<boolean>, () => React.ReactNode]} A TUPLE CONTAINING THE CONFIRM FUNCTION AND THE DIALOG COMPONENT
 */
export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps['variant'] = 'default'
): [() => Promise<unknown>, () => React.ReactNode] => {
  // STATE
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>()

  // HANDLERS
  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve })
    })
  }

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const ConfirmationDialog = () => (
    <ResponsiveModal
      open={!!promise}
      onOpenChange={handleClose}
      hideHeader
      title={title}
      description={message}
    >
      <Card className='size-full border-none shadow-none'>
        <CardContent>
          <CardHeader className='p-0'>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          {/* BUTTON CONTAINER WITH RESPONSIVE LAYOUT */}
          <div className='pt-4 w-full flex flex-col gap-2 lg:flex-row items-center justify-end'>
            {/* CANCEL BUTTON */}
            <Button
              variant='outline'
              onClick={handleCancel}
              className='w-full lg:w-auto'
            >
              Cancelar
            </Button>
            {/* CONFIRM BUTTON */}
            <Button
              variant={variant}
              onClick={handleConfirm}
              className='w-full lg:w-auto'
            >
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  )

  return [confirm, ConfirmationDialog]
}
