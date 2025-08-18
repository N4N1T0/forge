import {
  type Account as AccountType,
  type Databases as DatabasesType,
  type Models,
  type Storage as StorageType
} from 'node-appwrite'
import { Workspaces } from './appwrite'

export interface GetMembersParams {
  databases: DatabasesType
  workspaceId: string
  userId: string
}

export type MiddleWareContext = {
  Variables: {
    account: AccountType
    databases: DatabasesType
    storage: StorageType
    users: Models.User
    user: Models.User<Models.Preferences>
  }
}

export interface createWorkspacesFormProps {
  onCancel?: () => void
}

export interface editWorkspacesFormProps {
  onCancel?: () => void
  initialValues: Workspaces
}
