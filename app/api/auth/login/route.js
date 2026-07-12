import { NextResponse } from 'next/server';

// Hardcoded users for testing
const USERS = [
  { email: 'admin@nacca.gov.gh', password: 'Admin@123', name: 'System Admin', role: 'SUPER_ADMIN' },
  { email: 'hr@nacca.gov.gh', password: 'Hr@123', name: 'HR Admin', role: 'HR_ADMIN' },
  { email: 'dg@nacca.gov.gh', password: 'Dg@123', name: 'Director General', role: 'DIRECTOR_GENERAL' },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt:', email); // For debugging

    // Find user
    const user = USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create response with user data (no JWT for now)
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    // Set a simple cookie
    response.cookies.set('auth_user', JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role
    }), {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}