import { NextResponse } from 'next/server';
import { createStaffAccount } from '../../../../lib/users';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, staffId, department, role = 'STAFF' } = body;

    console.log('Creating account for:', email);
    console.log('Data received:', { email, name, staffId, department, role });

    if (!email || !name || !staffId || !department) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = createStaffAccount(email, name, staffId, department, role);
    console.log('Create account result:', result);

    if (result.success) {
      // Make sure we're returning the tempPassword
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        tempPassword: result.tempPassword || 'Password not generated',
        user: result.user
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Create account error:', error);
    return NextResponse.json(
      { error: 'Failed to create account: ' + error.message },
      { status: 500 }
    );
  }
}