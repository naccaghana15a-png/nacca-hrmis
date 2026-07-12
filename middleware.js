import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const publicPaths = ['/', '/api/auth/login', '/api/auth/logout'];
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const token = cookies().get('auth_token');
  
  if (!token && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};