import { GitHubIcon, GoogleIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { useOauth } from '@/features/auth/hooks/use-oauth'
import Image from 'next/image'
import { OAuthProvider } from 'node-appwrite'

// TYPES
interface Props {
  isLoading: boolean
}

export const OauthSignInBtn = ({ isLoading }: Props) => {
  // HOOKS
  const { mutate: startOauth, isPending } = useOauth()

  // CONST
  const disabled = isLoading || isPending

  return (
    <div className='grid grid-cols-2 gap-3'>
      <Button
        variant='outline'
        disabled={disabled}
        onClick={() => startOauth({ provider: OAuthProvider.Google })}
      >
        <Image src={GoogleIcon} alt='Google Icon' className='size-5 mr-2' />
        Google
      </Button>
      <Button
        variant='outline'
        disabled={disabled}
        onClick={() => startOauth({ provider: OAuthProvider.Github })}
      >
        <Image src={GitHubIcon} alt='GitHub Icon' className='size-5 mr-2' />
        GitHub
      </Button>
    </div>
  )
}
