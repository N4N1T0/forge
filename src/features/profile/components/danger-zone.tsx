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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/modal/dialog'
import { useDeleteAccount } from '@/features/profile/hooks/use-delete-account'
import {
  deleteAccountSchema,
  DeleteAccountSchema
} from '@/features/profile/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface DangerZoneProps {
  userEmail: string
}

export function DangerZone({ userEmail }: DangerZoneProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: deleteAccount, isPending } = useDeleteAccount()

  const form = useForm<DeleteAccountSchema>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      email: '',
      confirmation: ''
    }
  })

  const onSubmit = (data: DeleteAccountSchema) => {
    deleteAccount({ json: data })
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      form.reset()
    }
  }

  return (
    <div className='col-span-1 md:col-span-2'>
      <Card className='border-destructive'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='size-5 text-destructive' />
            <CardTitle className='text-destructive'>Delete Account</CardTitle>
          </div>
          <CardDescription>
            Once you delete your account, there is no going back. Please be
            certain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant='destructive'
            className='w-full'
            onClick={() => setIsDialogOpen(true)}
          >
            Delete my account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader className='border-b pb-4'>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className='sr-only'>
              This action cannot be undone. It will permanently delete your
              account and all your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='mb-0.5'>
                      Confirm your email ({userEmail})
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder={userEmail}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='mb-0.5'>
                      Type &quot;Delete my account&quot; to confirm
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Delete my account'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='destructive'
                  disabled={isPending}
                >
                  {isPending ? 'Deleting...' : 'Delete my account'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
