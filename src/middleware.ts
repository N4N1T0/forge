import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE } from './features/auth/constants'

export default async function name(req: NextRequest) {
  const cookie = await cookies()
  const session = cookie.get(AUTH_COOKIE)
  const { pathname, origin } = req.nextUrl

  const isRoot = pathname === '/'
  const isWorkspace = pathname.startsWith('/workspace')

  if (!session && isWorkspace) {
    return NextResponse.redirect(new URL('/', origin))
  }

  if (session && isRoot) {
    return NextResponse.redirect(new URL('/workspace', origin))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
