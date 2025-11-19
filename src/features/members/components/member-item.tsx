import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { sanitizeContent } from '@/features/tasks/utils'
import { Members } from '@/types/appwrite'
import { Models } from 'node-appwrite'
import { Fragment } from 'react'
import { MemberAvatar } from './member-avatar'
import { MemberMoreBtn } from './member-more-btn'

// TYPES
interface MemberItemProps {
  member: (Members & Models.User<Models.Preferences>) | null
  isLast: boolean
  canUseMoreBtn: boolean
  isOwner: boolean
}

export const MemberItem = ({
  member,
  canUseMoreBtn,
  isOwner
}: MemberItemProps) => {
  // RENDER
  if (!member) return null

  return (
    <Fragment key={member.$id}>
      <TableRow className='border-b'>
        <TableCell>
          <div className='flex items-center gap-2'>
            <MemberAvatar member={member} />
            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium'>{member.name ?? 'Unknown'}</p>
              {isOwner && <Badge variant='secondary'>OWNER</Badge>}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <p className='text-sm text-muted-foreground'>{member.email ?? ''}</p>
        </TableCell>
        <TableCell>
          <Badge variant='outline'>{member.role ?? 'Unknown'}</Badge>
        </TableCell>
        <TableCell>
          <p className='text-sm truncate max-w-[28rem]'>
            {sanitizeContent((member.prefs as { bio?: string })?.bio ?? '')}
          </p>
        </TableCell>
        <TableCell className='text-right'>
          {canUseMoreBtn && <MemberMoreBtn member={member} />}
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
