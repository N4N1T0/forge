import { Workspaces } from './appwrite'

export type Layouts = Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>

export type Params = Promise<{ [key: string]: string | string[] | undefined }>

export interface WorkspaceAvatarProps {
  workspace: Workspaces
  className?: string
}

export interface GetWorkspaceActionProps {
  workspaceId: string
}

export interface GetProjectActionProps {
  projectId: string
}

export interface JoinWorkspaceFormProps {
  initialValues: {
    workspaceId: string
    name: string
    inviteCode: string
  }
}
