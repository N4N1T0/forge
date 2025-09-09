import { Workspaces } from './appwrite'

export type Layouts = Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>

type Params = Promise<{ [key: string]: string | string[] | undefined }>

export interface WorkspaceAvatarProps {
  workspace: Workspaces
  className?: string
}

export interface WorkspaceIdProps {
  params: Params
}

export interface JoinWorkspaceProps {
  params: Params
  searchParams: Params
}

export interface GetWorkspaceActionProps {
  workspaceId: string
}

export interface GetWorkspaceInfoActionProps {
  workspaceId: string
}

export interface JoinWorkspaceFormProps {
  initialValues: {
    workspaceId: string
    name: string
    inviteCode: string
  }
}
