import { NextResponse } from 'next/server';

// Role-based access control
const roleAccess = {
  'SUPER_ADMIN': ['/admin', '/admin/employees', '/admin/leave', '/admin/attendance', '/admin/performance', '/admin/training', '/admin/recruitment', '/admin/assets', '/admin/documents', '/admin/payroll', '/admin/analytics', '/admin/reports', '/admin/settings', '/admin/profile'],
  'DIRECTOR': ['/admin', '/admin/leave', '/admin/attendance', '/admin/training', '/admin/profile', '/admin/performance', '/admin/analytics', '/admin/reports', '/admin/employees'],
  'STAFF': ['/admin', '/admin/leave', '/admin/attendance', '/admin/training', '/admin/profile'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public paths
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check authentication
  const token = request.cookies.get('auth_user');
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Get user role from cookie
  let userRole = 'STAFF';
  try {
    const userData = JSON.parse(decodeURIComponent(token.value));
    userRole = userData.role || 'STAFF';
  } catch (e) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check role-based access
  const allowedPaths = roleAccess[userRole] || [];
  const isAllowed = allowedPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (!isAllowed && pathname.startsWith('/admin')) {
    // Redirect to dashboard if trying to access unauthorized page
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};