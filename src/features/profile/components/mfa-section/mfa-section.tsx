'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { MFAQRDialog } from '@/features/profile/components/mfa-section/mfa-qr-dialog'
import {
  useDisableMFA,
  useEnableMFA
} from '@/features/profile/server/use-toggle-mfa'
import { useVerifyMFA } from '@/features/profile/server/use-verify-mfa'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2, Shield, ShieldOff } from 'lucide-react'
import { useState } from 'react'

interface MFASectionProps {
  mfaEnabled: boolean
}

export function MFASection({ mfaEnabled }: MFASectionProps) {
  // STATES
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [qrCode, setQrCode] = useState<string>('')
  const [otpCode, setOtpCode] = useState('')

  // HOOKS
  const { mutate: enableMFA, isPending: isEnabling } = useEnableMFA()
  const { mutate: verifyMFA, isPending: isVerifying } = useVerifyMFA()
  const { mutate: disableMFA, isPending: isDisabling } = useDisableMFA()

  const [confirmDisable, DisableDialog] = useConfirm(
    'Disable two-factor authentication',
    'Are you sure you want to disable MFA? This will reduce your account security.',
    'destructive'
  )

  // HANDLERS
  const handleEnableMFA = () => {
    enableMFA(undefined, {
      onSuccess: (data) => {
        if (data.success) {
          setQrCode(data.data.qr)
          setShowQRDialog(true)
        }
      }
    })
  }

  const handleVerifyMFA = () => {
    if (!otpCode || otpCode.length !== 6) return

    verifyMFA(
      { otp: otpCode },
      {
        onSuccess: (data) => {
          if (data.success) {
            setShowQRDialog(false)
            setQrCode('')
            setOtpCode('')
          }
        }
      }
    )
  }

  const handleDisableMFA = async () => {
    const confirmed = await confirmDisable()
    if (confirmed) {
      disableMFA()
    }
  }

  const handleCloseDialog = () => {
    setShowQRDialog(false)
    setQrCode('')
    setOtpCode('')
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication (MFA)</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-3'>
            {mfaEnabled ? (
              <Shield className='size-5 text-primary' />
            ) : (
              <ShieldOff className='size-5 text-muted-foreground' />
            )}
            <div>
              <p className='text-sm font-medium'>
                {mfaEnabled
                  ? 'Your account is protected with MFA'
                  : 'Your account is not protected with MFA'}
              </p>
              <p className='text-muted-foreground text-sm'>
                {mfaEnabled
                  ? 'An additional code is required when signing in'
                  : 'Enable MFA for better security'}
              </p>
            </div>
          </div>
          <Button
            variant={mfaEnabled ? 'destructive' : 'default'}
            onClick={mfaEnabled ? handleDisableMFA : handleEnableMFA}
            disabled={isEnabling || isDisabling}
            className='mt-5 w-full'
          >
            {isEnabling || isDisabling ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Processing...
              </>
            ) : mfaEnabled ? (
              'Disable'
            ) : (
              'Enable'
            )}
          </Button>
        </CardContent>
      </Card>

      <MFAQRDialog
        open={showQRDialog}
        onOpenChange={handleCloseDialog}
        qrCode={qrCode}
        otpCode={otpCode}
        onOtpChange={setOtpCode}
        onVerify={handleVerifyMFA}
        isVerifying={isVerifying}
      />

      <DisableDialog />
    </>
  )
}
