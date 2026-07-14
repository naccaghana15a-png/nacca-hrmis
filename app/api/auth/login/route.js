import { NextResponse } from 'next/server';

// ============================================================
// 🔐 HARDCODED USERS - WORKS EVERY TIME
// ============================================================
const USERS = {
  'admin@nacca.gov.gh': {
    password: 'Admin@123',
    name: 'System Administrator',
    role: 'SUPER_ADMIN',
    staffId: 'NAC-IT-0001',
    department: 'ICT',
    isFirstLogin: false
  },
  'director@nacca.gov.gh': {
    password: 'Director@123',
    name: 'Reginald George Quartey',
    role: 'DIRECTOR',
    staffId: 'NAC-CD-0001',
    department: 'Curriculum',
    isFirstLogin: false
  },
  'hr@nacca.gov.gh': {
    password: 'Hr@123',
    name: 'Elijah Intsiful',
    role: 'DIRECTOR',
    staffId: 'NAC-HR-0001',
    department: 'Human Resource',
    isFirstLogin: false
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Login attempt:', email);

    // Check if user exists
    const user = USERS[email];
    if (!user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      console.log('❌ Wrong password for:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Login successful:', email);

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      isFirstLogin: false,
      user: {
        email: email,
        name: user.name,
        role: user.role,
        staffId: user.staffId,
        department: user.department
      }
    });

    // Set cookie
    response.cookies.set('auth_user', JSON.stringify({
      email: email,
      name: user.name,
      role: user.role,
      staffId: user.staffId,
      department: user.department,
      isFirstLogin: false
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed: ' + error.message },
      { status: 500 }
    );
  }
}