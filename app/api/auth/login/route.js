import { NextResponse } from 'next/server';
import { users, tempPasswords, changePassword, resetPassword, initDemoUsers } from '../../../../lib/users';

// Initialize demo users
initDemoUsers();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, newPassword, confirmPassword, action } = body;

    console.log('📝 Login attempt:', { email, action });

    // Handle Forgot Password
    if (action === 'reset_password') {
      return await handleForgotPassword(email);
    }

    // Handle Password Change (First Login)
    if (action === 'change_password') {
      return await handlePasswordChange(email, password, newPassword, confirmPassword);
    }

    // Regular Login
    return await handleLogin(email, password);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

async function handleLogin(email, password) {
  console.log('🔍 Login attempt for:', email);
  console.log('🔑 Password provided:', password);

  // ✅ Get user from imported users object (not hardcoded)
  const user = users[email];

  if (!user) {
    console.log('❌ User not found:', email);
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  console.log('👤 User found:', user.name);
  console.log('🔑 Temp password for email:', tempPasswords[email]);
  console.log('🔑 User password:', user.password);
  console.log('🔑 isFirstLogin:', user.isFirstLogin);

  if (user.accountLocked) {
    return NextResponse.json(
      { error: 'Account is locked. Please contact HR or System Administrator.' },
      { status: 403 }
    );
  }

  // ✅ Check temporary password first (for first-time login)
  const isTempPassword = tempPasswords[email] === password;
  const isValidPassword = user.password === password;

  console.log('🔍 isTempPassword:', isTempPassword);
  console.log('🔍 isValidPassword:', isValidPassword);

  // ✅ First-time login with temporary password
  if (user.isFirstLogin && isTempPassword) {
    console.log('✅ First-time login with temp password for:', email);
    user.failedAttempts = 0;
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const response = NextResponse.json({
      success: true,
      isFirstLogin: true,
      requiresPasswordChange: true,
      user: {
        email: email,
        name: user.name,
        role: user.role,
        staffId: user.staffId,
        department: user.department
      }
    });

    response.cookies.set('auth_user', JSON.stringify({
      email: email,
      name: user.name,
      role: user.role,
      staffId: user.staffId,
      department: user.department,
      isFirstLogin: true
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  }

  // ✅ Regular login with actual password
  if (isValidPassword) {
    console.log('✅ Regular login for:', email);
    user.failedAttempts = 0;
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      console.log('✅ isFirstLogin set to false for:', email);
    }

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
  }

  // ❌ Invalid password
  console.log('❌ Invalid password for:', email);
  user.failedAttempts = (user.failedAttempts || 0) + 1;

  if (user.failedAttempts >= 5) {
    user.accountLocked = true;
    return NextResponse.json(
      { error: 'Account locked due to multiple failed attempts. Please contact HR.' },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { error: 'Invalid email or password.' },
    { status: 401 }
  );
}

async function handlePasswordChange(email, currentPassword, newPassword, confirmPassword) {
  const user = users[email];

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  console.log('🔑 Password change for:', email);
  console.log('🔑 Current password provided:', currentPassword);
  console.log('🔑 Temp password:', tempPasswords[email]);

  const isValidCurrent = user.password === currentPassword || tempPasswords[email] === currentPassword;
  if (!isValidCurrent) {
    console.log('❌ Current password is incorrect');
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 401 }
    );
  }

  const validationErrors = validatePassword(newPassword, confirmPassword, currentPassword, user);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { errors: validationErrors },
      { status: 400 }
    );
  }

  const result = changePassword(email, newPassword);

  if (result.success) {
    user.password = newPassword;
    user.isFirstLogin = false;
    delete tempPasswords[email];

    console.log('✅ Password changed successfully for:', email);
    console.log('✅ isFirstLogin set to false');

    sendPasswordChangeEmail(email, user.name);

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully! Please login with your new password.'
    });
  } else {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }
}

async function handleForgotPassword(email) {
  const user = users[email];

  if (!user) {
    return NextResponse.json({
      success: true,
      message: 'If the email exists in our system, a password reset link has been sent.'
    });
  }

  const result = resetPassword(email);

  if (result.success) {
    sendPasswordResetEmail(email, user.name, result.tempPassword);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent!'
    });
  } else {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }
}

function validatePassword(newPassword, confirmPassword, currentPassword, user) {
  const errors = [];

  if (newPassword !== confirmPassword) {
    errors.push('Passwords do not match.');
  }
  if (newPassword.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(newPassword)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(newPassword)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(newPassword)) {
    errors.push('Password must contain at least one number.');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
    errors.push('Password must contain at least one special character (!@#$%^&*).');
  }
  if (currentPassword === newPassword) {
    errors.push('New password cannot be the same as the temporary password.');
  }

  return errors;
}

function sendPasswordChangeEmail(email, name) {
  console.log('========================================');
  console.log('📧 PASSWORD CHANGED NOTIFICATION');
  console.log('========================================');
  console.log('To:', email);
  console.log('From: noreply@nacca.gov.gh');
  console.log('Subject: Password Changed - NaCCA HRMIS');
  console.log('');
  console.log('Dear', name + ',');
  console.log('');
  console.log('Your password has been changed successfully.');
  console.log('');
  console.log('If you did not make this change, please contact HR immediately.');
  console.log('');
  console.log('Regards,');
  console.log('NaCCA HRMIS System');
  console.log('========================================');
}

function sendPasswordResetEmail(email, name, tempPassword) {
  console.log('========================================');
  console.log('📧 PASSWORD RESET');
  console.log('========================================');
  console.log('To:', email);
  console.log('From: noreply@nacca.gov.gh');
  console.log('Subject: Password Reset - NaCCA HRMIS');
  console.log('');
  console.log('Dear', name + ',');
  console.log('');
  console.log('Your password has been reset.');
  console.log('');
  console.log('Temporary Password:', tempPassword);
  console.log('');
  console.log('IMPORTANT: Please login with this temporary password and change it immediately.');
  console.log('');
  console.log('Login URL: https://nacca-hrmis.vercel.app');
  console.log('');
  console.log('Regards,');
  console.log('NaCCA HRMIS System');
  console.log('========================================');
}