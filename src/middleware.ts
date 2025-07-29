import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE } from './features/auth/constants'

export default async function name(req: NextRequest) {
  const cookie = await cookies()
  const session = cookie.get(AUTH_COOKIE)
  const { pathname, origin } = req.nextUrl

  const isRoot = pathname === '/'
  const isDashboard = pathname.startsWith('/dashboard')

  if (!session && isDashboard) {
    return NextResponse.redirect(new URL('/', origin))
  }

  if (session && isRoot) {
    return NextResponse.redirect(new URL('/dashboard', origin))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
