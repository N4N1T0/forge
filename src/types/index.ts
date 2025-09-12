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
