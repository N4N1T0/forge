type Layouts = Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>

type Params = Promise<{ [key: string]: string | string[] | undefined }>

interface WorkspaceAvatarProps {
  workspace: Workspaces
  className?: string
}

interface MemberAvatarProps {
  member: Members
  className?: string
  fallbackClassName?: string
}

interface WorkspaceIdProps {
  params: Params
}

interface JoinWorkspaceProps {
  params: Params
  searchParams: Params
}

interface GetWorkspaceActionProps {
  workspaceId: string
}

interface GetWorkspaceInfoActionProps {
  workspaceId: string
}

interface JoinWorkspaceFormProps {
  initialValues: {
    workspaceId: string
    name: string
    inviteCode: string
  }
}
