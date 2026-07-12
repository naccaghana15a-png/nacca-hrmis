import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('auth_token');

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // Decode the base64 token
    const userData = JSON.parse(Buffer.from(token.value, 'base64').toString());
    return NextResponse.json({
      authenticated: true,
      user: { 
        email: userData.email, 
        name: userData.name, 
        role: userData.role 
      },
    });
  } catch (error) {
    cookies().delete('auth_token');
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}