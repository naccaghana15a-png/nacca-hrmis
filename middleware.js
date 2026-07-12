import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public paths (no auth required)
  const publicPaths = ['/', '/api/auth/login', '/api/auth/logout'];
  
  // Check if path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const token = cookies().get('auth_token');
  
  if (!token && !pathname.startsWith('/api')) {
    // Redirect to login for protected pages
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};