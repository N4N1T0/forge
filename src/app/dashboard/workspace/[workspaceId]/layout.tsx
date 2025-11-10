import { ReactNode } from 'react'

interface WorkspaceLayoutProps {
  children: ReactNode
  modal: ReactNode
}

export default function WorkspaceLayout({
  children,
  modal
}: WorkspaceLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
