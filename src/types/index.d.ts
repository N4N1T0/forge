type Layouts = Readonly<{
  children: React.ReactNode
}>

interface WorkspaceAvatarProps {
  workspace: Workspaces
  className?: string
}

type MiddleWareContext = {
  Variables: {
    account: AccountType
    databases: DatabasesType
    storage: StorageType
    users: Models.User
    user: Models.User<Models.Preferences>
  }
}
