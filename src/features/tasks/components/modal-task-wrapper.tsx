'use client'

import { useGetMembers } from '@/features/members/server/use-get-members'
import { useGetCurrentWorkspace } from '@/features/workspaces/client/use-workspace-id'
import { FormattedMembers } from '@/types'
import { Workspaces } from '@/types/appwrite'
import { ReactNode } from 'react'

interface ModalTaskWrapperProps {
  children: (props: {
    workspace: Partial<Workspaces> | undefined
    members: FormattedMembers
    isLoading: boolean
  }) => ReactNode
}

export const ModalTaskWrapper = ({ children }: ModalTaskWrapperProps) => {
  // DATA FETCHING
  const { workspace, isLoading: isLoadingWorkspace } = useGetCurrentWorkspace()
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId: workspace?.$id as string
  })

  const isLoading = isLoadingWorkspace || isLoadingMembers

  return (
    <>
      {children({
        workspace,
        members,
        isLoading
      })}
    </>
  )
}
