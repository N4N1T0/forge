'use client'

import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/modal/dialog'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface MFAQRDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCode: string
  otpCode: string
  onOtpChange: (value: string) => void
  onVerify: () => void
  isVerifying: boolean
}

export function MFAQRDialog({
  open,
  onOpenChange,
  qrCode,
  otpCode,
  onOtpChange,
  onVerify,
  isVerifying
}: MFAQRDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Set up two-factor authentication</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app
          </DialogDescription>
        </DialogHeader>

        <form className='space-y-4'>
          {qrCode && (
            <div className='flex justify-center rounded-lg border bg-white p-4'>
              <Image
                src={qrCode}
                alt='QR code for MFA'
                width={200}
                height={200}
                className='size-[200px]'
              />
            </div>
          )}

          <div className='space-y-3'>
            <div className='flex justify-center'>
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={onOtpChange}
                id='otp'
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className='text-muted-foreground text-center text-xs'>
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <div className='flex justify-end items-center gap-2 border-t pt-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button type='submit' onClick={onVerify} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  Verifying...
                </>
              ) : (
                'Verify and activate'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
