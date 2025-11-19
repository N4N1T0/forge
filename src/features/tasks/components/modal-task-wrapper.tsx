'use client'

import { useCurrent } from '@/features/auth'
import { useGetMembers } from '@/features/members/server/use-get-members'
import { useProjectId } from '@/features/projects/hooks/use-project-id'
import { useGetCurrentWorkspace } from '@/features/workspaces/hooks/use-workspace-id'
import { FormattedMembers } from '@/types'
import { Workspaces } from '@/types/appwrite'
import { ReactNode } from 'react'

interface ModalTaskWrapperProps {
  children: (props: {
    workspace: Partial<Workspaces> | undefined
    members: FormattedMembers
    projectId: string
    currentUserId: string | undefined
    isLoading: boolean
  }) => ReactNode
}

export const ModalTaskWrapper = ({ children }: ModalTaskWrapperProps) => {
  // DATA FETCHING
  const { workspace, isLoading: isLoadingWorkspace } = useGetCurrentWorkspace()
  const { data: currentUser, isLoading: isLoadingUser } = useCurrent()
  const projectId = useProjectId()
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId: workspace?.$id as string
  })

  const isLoading = isLoadingWorkspace || isLoadingMembers || isLoadingUser

  return (
    <>
      {children({
        workspace,
        members,
        projectId,
        currentUserId: currentUser?.$id,
        isLoading
      })}
    </>
  )
}
