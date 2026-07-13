import { NextResponse } from 'next/server';
import { createStaffAccount } from '@/lib/users';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, staffId, department, role = 'STAFF' } = body;

    if (!email || !name || !staffId || !department) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = createStaffAccount(email, name, staffId, department, role);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        tempPassword: result.tempPassword,
        user: result.user
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}