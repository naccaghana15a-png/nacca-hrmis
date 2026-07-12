import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Hardcoded users for demo (since env vars might not be loading)
const DEMO_USERS = [
  { email: 'admin@nacca.gov.gh', password: 'Admin@123', role: 'SUPER_ADMIN', name: 'System Admin' },
  { email: 'hr@nacca.gov.gh', password: 'Hr@123', role: 'HR_ADMIN', name: 'HR Administrator' },
  { email: 'dg@nacca.gov.gh', password: 'Dg@123', role: 'DIRECTOR_GENERAL', name: 'Dr. Samuel Ofori' },
  { email: 'director@nacca.gov.gh', password: 'Director@123', role: 'DIRECTOR', name: 'Anthony Sarpong' },
  { email: 'staff@nacca.gov.gh', password: 'Staff@123', role: 'STAFF', name: 'John Mensah' },
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a simple token (no JWT needed for demo)
    const token = Buffer.from(JSON.stringify({ 
      email: user.email, 
      role: user.role, 
      name: user.name,
      timestamp: Date.now()
    })).toString('base64');

    // Set cookie
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}