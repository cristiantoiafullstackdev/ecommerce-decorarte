import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Forzamos la intercepción de cualquier ruta que comience con /admin
  if (path.startsWith('/admin')) {
    const session = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // Si no hay sesión, forzamos el redirect al login con la callbackUrl
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }

    // Si hay sesión pero no es ADMIN, afuera
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Ampliamos el matcher para asegurarnos de que evalúe cualquier sub-ruta
export const config = {
  matcher: ['/admin/:path*', '/admin'],
}