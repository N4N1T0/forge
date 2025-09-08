import {
  type Account as AccountType,
  type Models,
  type Storage as StorageType,
  type TablesDB as TablesDBType
} from 'node-appwrite'
import { Workspaces } from './appwrite'

export interface GetMembersParams {
  databases: TablesDBType
  workspaceId: string
  userId: string
}

export type MiddleWareContext = {
  Variables: {
    account: AccountType
    tables: TablesDBType
    storage: StorageType
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
