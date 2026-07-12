import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    const authData = cookies['auth_user'];
    if (!authData) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = JSON.parse(decodeURIComponent(authData));
    return NextResponse.json({
      authenticated: true,
      user: user
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}