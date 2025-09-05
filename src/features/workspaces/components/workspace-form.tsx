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
import { Icon, IconPicker } from '@/components/ui/icon-picker'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { THEME_ITEMS } from '@/data'
import {
  CreateWorkspacesSchema,
  createWorkspacesSchema
} from '@/features/workspaces/schema'
import { useCreateWorkspace } from '@/features/workspaces/server/use-create-workspace'
import { generateSlug } from '@/lib/utils'
import { createWorkspacesFormProps } from '@/types/functions'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, MinusIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

const CreateWorkspacesForm = ({ onCancel }: createWorkspacesFormProps) => {
  // HOOKS
  const router = useRouter()
  const { mutate: createWorkspace, isPending } = useCreateWorkspace()
  const form = useForm<CreateWorkspacesSchema>({
    resolver: zodResolver(createWorkspacesSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'anvil',
      slug: '',
      theme: 'light'
    }
  })

  // CONST
  const { control, handleSubmit, reset } = form
  const origin = typeof window === 'undefined' ? '' : window.location.origin

  // HANDLER
  const onSubmit = async (values: CreateWorkspacesSchema) => {
    createWorkspace(
      { form: values },
      {
        onSuccess: (data) => {
          reset()
          onCancel?.()
          if (data.success)
            return router.push(`/dashboard/workspace/${data.data.$id}`)
        }
      }
    )
  }

  const handleCancel = () => {
    form.reset()
    onCancel?.()
  }

  return (
    <Card className='w-full max-w-2xl mx-auto shadow-lg overflow-y-auto'>
      <CardHeader className='space-y-2'>
        <CardTitle className='text-2xl md:text-3xl font-bold text-primary'>
          Create Workspace
        </CardTitle>
        <CardDescription className='text-sm md:text-base text-muted-foreground'>
          Create a new workspace to start collaborating with your team.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <fieldset className='flex gap-4 items-center w-full'>
              <FormField
                control={control}
                name='icon'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold text-muted-foreground'>
                      Icon
                    </FormLabel>
                    <IconPicker
                      value={field.value}
                      disabled={isPending}
                      onValueChange={(icon) => field.onChange(icon)}
                    >
                      <Button
                        variant='outline'
                        size='icon'
                        className='aspect-square size-12'
                        disabled={isPending}
                      >
                        {field.value ? (
                          <Icon name={field.value} />
                        ) : (
                          'Select Icon'
                        )}
                      </Button>
                    </IconPicker>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-sm font-semibold text-muted-foreground'>
                      Name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='name'
                        placeholder='Salamanders'
                        className='h-12 focus:ring-2 w-full'
                        autoComplete='on'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
            </fieldset>

            <FormField
              control={control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-muted-foreground'>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Into the fires of battle, unto the anvil of war!'
                      className='h-12 focus:ring-2'
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-muted-foreground'>
                    Slug (Invite Link)
                  </FormLabel>
                  <FormControl>
                    <div className='flex'>
                      <span className='border-input dark:bg-input/30 bg-transparent text-muted-foreground inline-flex items-center border px-3 text-xs'>
                        {`${origin}/join/`}
                      </span>
                      <Input
                        {...field}
                        className='h-12 focus:ring-2'
                        placeholder={
                          generateSlug(form.watch('name')) || 'salamanders'
                        }
                        type='text'
                        disabled={isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='theme'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold text-muted-foreground'>
                    Theme
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className='flex gap-3'
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {THEME_ITEMS.map(({ value, label, image }) => (
                        <label key={`${value}-${value}`}>
                          <RadioGroupItem
                            id={`${value}-${value}`}
                            className='peer sr-only after:absolute after:inset-0'
                            value={value}
                          />
                          <Image
                            src={image}
                            alt={label}
                            width={88}
                            height={70}
                            className='border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50'
                          />
                          <span className='group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1'>
                            <CheckIcon
                              size={16}
                              className='group-peer-data-[state=unchecked]:hidden'
                              aria-hidden='true'
                            />
                            <MinusIcon
                              size={16}
                              className='group-peer-data-[state=checked]:hidden'
                              aria-hidden='true'
                            />
                            <span className='text-xs font-medium'>{label}</span>
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            {/* TODO: SHORTCUT */}
            <Separator />

            <div className='flex justify-end items-center gap-3 flex-wrap'>
              <Button
                type='button'
                variant='secondary'
                size='lg'
                onClick={handleCancel}
                disabled={isPending}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                size='lg'
                disabled={isPending}
                className='flex-1'
              >
                {isPending ? 'Creating...' : 'Create Workspace'}
              </Button>
            </div>

            <Separator />

            <p className='text-xs text-muted-foreground text-center'>
              if you like to support my work and keep me motivated, please
              consider
              <a
                href='https://buymeacoffee.com/n4n1t0'
                target='_blank'
                className='text-primary hover:underline ml-1 inline-block'
              >
                buying me a coffee
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateWorkspacesForm
