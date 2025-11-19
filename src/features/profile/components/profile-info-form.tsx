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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateProfile } from '@/features/profile/hooks/use-update-profile'
import {
  updateProfileSchema,
  UpdateProfileSchema
} from '@/features/profile/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface ProfileInfoFormProps {
  initialName: string
  initialBio?: string
}

export function ProfileInfoForm({
  initialName,
  initialBio
}: ProfileInfoFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialName,
      bio: initialBio || ''
    }
  })

  const bioValue = watch('bio')

  // Reset form when initial values change
  useEffect(() => {
    reset({
      name: initialName,
      bio: initialBio || ''
    })
  }, [initialName, initialBio, reset])

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
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name')}
              disabled={isPending}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className='text-destructive text-sm'>{errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio</Label>
            <RichTextEditor
              value={bioValue}
              onChange={(value) =>
                setValue('bio', value, { shouldDirty: true })
              }
              disabled={isPending}
              className='!min-h-[200px] w-full'
            />
            {errors.bio && (
              <p className='text-destructive text-sm'>{errors.bio.message}</p>
            )}
          </div>

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
      </CardContent>
    </Card>
  )
}
