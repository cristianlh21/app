// Volvemos a importar de next/server, pero mantenemos el archivo como proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode("clave-secreta-del-hotel-123")

// La función puede llamarse "proxy" o "default", Next 16 la reconocerá por el nombre del archivo
export default async function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const { pathname } = request.nextUrl

  // Si intenta entrar al dashboard...
  if (pathname.startsWith('/dashboard')) {
    // 1. ¿No hay token? Al login
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      // 2. ¿Token válido?
      await jwtVerify(token, SECRET_KEY)
      return NextResponse.next()
    } catch (e) {
      // 3. ¿Token corrupto? Al login
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Esto se queda igual
export const config = {
  matcher: ['/dashboard/:path*'],
}