import { NextResponse } from 'next/server';
import { users, tempPasswords, changePassword, resetPassword, initDemoUsers } from '@/lib/users';

// Initialize demo users
initDemoUsers();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, newPassword, confirmPassword, action } = body;

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
  const user = users[email];
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Check if account is locked
  if (user.accountLocked) {
    return NextResponse.json(
      { error: 'Account is locked. Please contact HR or System Administrator.' },
      { status: 403 }
    );
  }

  // Check if using temporary password
  const isTempPassword = tempPasswords[email] === password;
  const isValidPassword = user.password === password;

  // For first-time login, allow temp password
  if (user.isFirstLogin && isTempPassword) {
    // Successful login with temp password
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

  // Normal password check
  if (!isValidPassword) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    
    if (user.failedAttempts >= 5) {
      user.accountLocked = true;
      return NextResponse.json(
        { error: 'Account locked due to multiple failed attempts. Please contact HR.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: `Invalid email or password. ${5 - user.failedAttempts} attempts remaining.` },
      { status: 401 }
    );
  }

  // Successful login
  user.failedAttempts = 0;
  user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);

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

async function handlePasswordChange(email, currentPassword, newPassword, confirmPassword) {
  const user = users[email];
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Verify current password (either temp or actual)
  const isValidCurrent = user.password === currentPassword || tempPasswords[email] === currentPassword;
  if (!isValidCurrent) {
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 401 }
    );
  }

  // Validate new password
  const validationErrors = validatePassword(newPassword, confirmPassword, currentPassword, user);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { errors: validationErrors },
      { status: 400 }
    );
  }

  // Change password
  const result = changePassword(email, newPassword);

  if (result.success) {
    // Send email notification (simulated)
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
    // Send email with temporary password
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
  console.log(`
    ========================================
    📧 PASSWORD CHANGED NOTIFICATION
    ========================================
    To: ${email}
    From: noreply@nacca.gov.gh
    Subject: Password Changed - NaCCA HRMIS
    
    Dear ${name},
    
    Your password has been changed successfully.
    
    If you did not make this change, please contact HR immediately.
    
    Regards,
    NaCCA HRMIS System
    ========================================
  `);
}

function sendPasswordResetEmail(email, name, tempPassword) {
  console.log(`
    ========================================
    📧 PASSWORD RESET
    ========================================
    To: ${email}
    From: noreply@nacca.gov.gh
    Subject: Password Reset - NaCCA HRMIS
    
    Dear ${name},
    
    Your password has been reset.
    
    Temporary Password: ${tempPassword}
    
    IMPORTANT: Please login with this temporary password and change it immediately.
    
    Login URL: https://nacca-hrmis.vercel.app
    
    Regards,
    NaCCA HRMIS System
    ========================================
  `);
}