import { Role, Workspaces } from '@/types/appwrite'

export interface ProfileData {
  $id: string
  name: string
  email: string
  bio?: string
  mfaEnabled: boolean
  workspaces: Array<{
    workspace: Workspaces
    role: Role
    isLastAdmin: boolean
  }>
}

export interface WorkspaceCardProps {
  workspace: Workspaces
  userRole: Role
  isLastAdmin: boolean
}

export interface ProfileHeaderProps {
  name: string
  email: string
  initials: string
}

export interface ProfileInfoFormProps {
  initialName: string
  initialBio?: string
}

export interface PasswordChangeFormProps {
  onSuccess?: () => void
}

export interface MFASectionProps {
  mfaEnabled: boolean
}

export interface DangerZoneProps {
  userEmail: string
}
