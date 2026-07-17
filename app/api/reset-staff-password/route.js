import { NextResponse } from 'next/server';
import { users, tempPasswords } from '../../../lib/users';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = users[email];
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new temporary password
    const tempPassword = generateTempPassword();
    tempPasswords[email] = tempPassword;
    user.isFirstLogin = true;
    user.password = null;
    user.failedAttempts = 0;
    user.accountLocked = false;
    user.lockTime = null;

    console.log('🔑 Password reset for:', email);
    console.log('📧 New temp password:', tempPassword);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      email: email,
      tempPassword: tempPassword,
      instructions: 'Use this temporary password to login. You will be prompted to change it.'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reset password: ' + error.message },
      { status: 500 }
    );
  }
}

function generateTempPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()';
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  const all = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < 10; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}