import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const token = cookies().get('auth_token');

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'dev-secret-key');
    return NextResponse.json({
      authenticated: true,
      user: { email: decoded.email, name: decoded.name, role: decoded.role },
    });
  } catch (error) {
    cookies().delete('auth_token');
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}