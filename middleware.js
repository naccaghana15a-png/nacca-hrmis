import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only protect /admin routes
  const { pathname } = request.nextUrl;
  
  // Allow public access to login page and API
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check if trying to access admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_user');
    
    if (!token) {
      // Redirect to login
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};