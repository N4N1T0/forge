'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { useGetMemberSummaries } from '../api/use-get-member-summaries'
import { DashboardCardError } from './dashboard-card-error'
import { DashboardCardSkeleton } from './dashboard-card-skeleton'

interface MemberListCardProps {
  workspaceId: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function MemberListCard({ workspaceId }: MemberListCardProps) {
  const {
    data: members,
    isLoading,
    isError,
    error,
    refetch
  } = useGetMemberSummaries({ workspaceId })

  // LOADING
  if (isLoading) {
    return <DashboardCardSkeleton />
  }

  // ERROR
  if (isError) {
    return (
      <DashboardCardError
        title='Failed to load members'
        description={error?.message || 'Unable to fetch member data'}
        onRetry={() => refetch()}
      />
    )
  }

  // EMPTY
  if (!members || members.length === 0) {
    return (
      <Card role='region' aria-labelledby='members-title'>
        <CardHeader>
          <CardTitle id='members-title' className='text-base font-semibold'>
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Users
              className='h-12 w-12 text-muted-foreground/50 mb-3'
              aria-hidden='true'
            />
            <p className='text-sm text-muted-foreground'>
              No members yet. Invite team members to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card role='region' aria-labelledby='members-title'>
      <CardHeader>
        <CardTitle id='members-title' className='text-base font-semibold'>
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='flex gap-3' role='list' aria-label='Workspace members'>
          {members.map((member) => (
            <li
              key={member.id}
              className='flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent w-full'
              role='listitem'
            >
              {/* AVATAR */}
              <Avatar className='h-10 w-10'>
                {member.avatar && (
                  <AvatarImage
                    src={member.avatar}
                    alt={`${member.name}'s avatar`}
                  />
                )}
                <AvatarFallback
                  className='bg-primary/10 text-primary font-medium'
                  aria-label={`${member.name} initials`}
                >
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              {/* MEMBER INFO */}
              <div className='flex-1 min-w-0 space-y-0.5'>
                <div className='flex items-center gap-2 justify-between'>
                  <p
                    className='text-sm font-medium truncate'
                    aria-label={`Member name: ${member.name}`}
                  >
                    {member.name}
                  </p>
                  <Badge
                    variant={member.role === 'admin' ? 'default' : 'secondary'}
                    className='flex-shrink-0 text-xs px-1'
                    aria-label={`Role: ${member.role}`}
                  >
                    {member.role === 'admin' ? 'Admin' : 'Member'}
                  </Badge>
                </div>
                <p
                  className='text-xs text-muted-foreground truncate'
                  aria-label={`Email: ${member.email}`}
                >
                  {member.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
