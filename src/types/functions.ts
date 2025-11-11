import {
  type Account as AccountType,
  type Avatars as AvatarType,
  type Models,
  type Storage as StorageType,
  type TablesDB as TablesDBType,
  type Users as UsersType
} from 'node-appwrite'

export interface GetMembersParams {
  databases: TablesDBType
  workspaceId: string
  userId?: string
}

export interface GetMemberParams {
  databases: TablesDBType
  workspaceId?: string
  userId: string
}

export type MiddleWareContext = {
  Variables: {
    account: AccountType
    tables: TablesDBType
    storage: StorageType
    user: Models.User<Models.Preferences>
    avatar: AvatarType
  }
}

export type AdminMiddleWareContext = {
  Variables: {
    account: AccountType
    tables: TablesDBType
    storage: StorageType
    users: UsersType
  }
}
