type Layouts = Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>

interface WorkspaceAvatarProps {
  workspace: Workspaces
  className?: string
}

interface WorkspaceIdProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>
}

interface GetWorkspaceActionProps {
  workspaceId: string
}
