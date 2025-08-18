type Layouts = Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>

interface WorkspaceAvatarProps {
  workspace: Workspaces
  className?: string
}
