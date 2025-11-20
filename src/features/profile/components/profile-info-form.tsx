'use client'

import { RichTextEditor } from '@/components/tiptap/rich-text-editor'
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
import { useUpdateProfile } from '@/features/profile/hooks/use-update-profile'
import {
  updateProfileSchema,
  UpdateProfileSchema
} from '@/features/profile/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

// TYPES
interface ProfileInfoFormProps {
  initialName: string
  initialBio?: string
}

export function ProfileInfoForm({
  initialName,
  initialBio
}: ProfileInfoFormProps) {
  // HOOKS
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  // FORM
  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialName,
      bio: initialBio || ''
    }
  })
  const {
    handleSubmit,
    formState: { isDirty },
    reset,
    control
  } = form

  // EFFECT (Reset form when initial values change)
  useEffect(() => {
    reset({
      name: initialName,
      bio: initialBio || ''
    })
  }, [initialName, initialBio, reset])

  // HANDLER
  const onSubmit = (data: UpdateProfileSchema) => {
    updateProfile(
      { json: data },
      {
        onSuccess: () => {
          reset(data)
        }
      }
    )
  }

  return (
    <Card className='col-span-1 md:col-span-3 overflow-hidden'>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your name and bio to personalize your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* NAME FIELD */}
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      id='name'
                      {...field}
                      disabled={isPending}
                      aria-invalid={!!form.formState.errors.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BIO */}
            <FormField
              control={control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      disabled={isPending}
                      className='!min-h-[200px] w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => reset()}
                disabled={!isDirty || isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={!isDirty || isPending}>
                {isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
