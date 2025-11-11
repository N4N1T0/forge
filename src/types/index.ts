import { QueryObserverResult } from '@tanstack/react-query'
import { Models, Role } from 'node-appwrite'
import { Members, Projects, Status, TaskComments, Tasks } from './appwrite'

export type Layouts = Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>

export type Params = Promise<{ [key: string]: string | string[] | undefined }>

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

export interface ResponsiveModalProps {
  children: React.ReactNode
  className?: string
}

export interface BaseFormProps {
  onCancel?: () => void
}

export interface FormWithInitialValues<T> extends BaseFormProps {
  initialValues: T
}

export type FormattedTasks = (Tasks & {
  project: Projects | undefined
  assignee:
    | (Members & {
        name: string
        email: string
      })
    | undefined
})[]

export type FormattedMembers =
  | ((Members & Models.User<Models.Preferences>) | null)[]
  | undefined

export type MentionableMember = {
  $id: string
  name: string
  email: string
  avatar?: string
}

export type PopulatedComment = TaskComments & {
  author: MentionableMember
  mentionedUsers: MentionableMember[]
}

export interface DataViewProps {
  data: FormattedTasks | undefined
  isLoading: boolean
  error?: boolean
  refetch?: () => Promise<QueryObserverResult<FormattedTasks>>
}

export interface DataCalendarFormattedEvents {
  title: string
  project: Projects | undefined
  status: Status
  id: string
  assignee:
    | (Models.Row & {
        userId: string | null
        workspaceId: string | null
        role: Role
      } & {
        name: string
        email: string
      })
    | undefined
  start: Date
  end: Date
}
