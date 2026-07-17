import { NextResponse } from 'next/server';
import { supabase, getUserByEmail, updateUser, getTempPassword, setTempPassword, deleteTempPassword } from '../../../../lib/supabase';
import { users, tempPasswords, initDemoUsers } from '../../../../lib/users';

// Initialize demo users (for fallback)
initDemoUsers();

// ============================================================
// 📧 EMAIL FUNCTIONS
// ============================================================
function sendPasswordChangeEmail(email, name) {
  console.log('📧 Password changed for:', email);
}

function sendPasswordResetEmail(email, name, tempPassword) {
  console.log('📧 Password reset for:', email, 'Temp:', tempPassword);
}

// ============================================================
// 🔑 GENERATE TEMPORARY PASSWORD
// ============================================================
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

// ============================================================
// 📝 LOGIN API
// ============================================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, newPassword, confirmPassword, action } = body;

    console.log('📝 Login attempt:', { email, action });

    if (action === 'reset_password') {
      return await handleForgotPassword(email);
    }

    if (action === 'change_password') {
      return await handlePasswordChange(email, password, newPassword, confirmPassword);
    }

    return await handleLogin(email, password);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed: ' + error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// 🔑 HANDLE LOGIN
// ============================================================
async function handleLogin(email, password) {
  console.log('🔍 Login attempt for:', email);

  // ✅ FIRST: Try Supabase
  let user = null;
  let isFromSupabase = false;
  
  try {
    const dbUser = await getUserByEmail(email);
    if (dbUser) {
      isFromSupabase = true;
      user = {
        password: dbUser.password,
        name: dbUser.name,
        role: dbUser.role,
        staffId: dbUser.staff_id,
        department: dbUser.department,
        isFirstLogin: dbUser.is_first_login === 1,
        accountLocked: dbUser.account_locked === 1,
        failedAttempts: dbUser.failed_attempts || 0,
        lockTime: dbUser.lock_time,
        lastLogin: dbUser.last_login,
        email: email
      };
      console.log('✅ User found in Supabase:', email);
    }
  } catch (dbError) {
    console.log('⚠️ Supabase lookup error:', dbError.message);
  }

  // ✅ SECOND: Fallback to memory
  if (!user) {
    const memoryUser = users[email];
    if (memoryUser) {
      user = memoryUser;
      console.log('✅ Using memory user:', email);
    }
  }

  if (!user) {
    console.log('❌ User not found:', email);
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  console.log('👤 User found:', user.name);
  console.log('🔑 isFirstLogin:', user.isFirstLogin);

  // ✅ Check if account is locked
  if (user.accountLocked) {
    const lockTime = user.lockTime ? new Date(user.lockTime).getTime() : 0;
    const now = Date.now();
    const lockDuration = 30 * 60 * 1000;

    if (now - lockTime > lockDuration) {
      user.accountLocked = false;
      user.failedAttempts = 0;
      user.lockTime = null;
      if (isFromSupabase) {
        await updateUser(email, { account_locked: 0, failed_attempts: 0, lock_time: null });
      }
      console.log('🔓 Account auto-unlocked:', email);
    } else {
      const remainingMinutes = Math.ceil((lockDuration - (now - lockTime)) / 60000);
      return NextResponse.json(
        { 
          error: `Account is locked. Please try again in ${remainingMinutes} minute(s) or contact HR.`,
          locked: true,
          remainingMinutes: remainingMinutes
        },
        { status: 403 }
      );
    }
  }

  // ✅ Check temp password
  let tempPassword = null;
  if (isFromSupabase) {
    tempPassword = await getTempPassword(email);
  }
  if (!tempPassword) {
    tempPassword = tempPasswords[email] || null;
  }
  
  const isTempPassword = tempPassword === password;
  const isValidPassword = user.password === password;

  console.log('🔍 isTempPassword:', isTempPassword);
  console.log('🔍 isValidPassword:', isValidPassword);

  // ✅ First-time login with temporary password
  if (user.isFirstLogin && isTempPassword) {
    console.log('✅ First-time login with temp password for:', email);
    user.failedAttempts = 0;
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    if (isFromSupabase) {
      await updateUser(email, { failed_attempts: 0, last_login: user.lastLogin });
    }

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
    user.accountLocked = false;
    user.lockTime = null;
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      console.log('✅ isFirstLogin set to false for:', email);
    }

    if (isFromSupabase) {
      await updateUser(email, { 
        failed_attempts: 0, 
        account_locked: 0, 
        lock_time: null,
        last_login: user.lastLogin,
        is_first_login: 0 
      });
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

  // ❌ Invalid password - increment attempts
  console.log('❌ Invalid password for:', email);
  user.failedAttempts = (user.failedAttempts || 0) + 1;
  const remainingAttempts = 5 - user.failedAttempts;

  if (isFromSupabase) {
    await updateUser(email, { failed_attempts: user.failedAttempts });
  }

  if (user.failedAttempts >= 5) {
    user.accountLocked = true;
    user.lockTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    if (isFromSupabase) {
      await updateUser(email, { account_locked: 1, lock_time: user.lockTime });
    }
    console.log('🔒 Account locked for:', email);
    return NextResponse.json(
      { 
        error: 'Account locked due to 5 failed login attempts. Please contact HR or wait 30 minutes.',
        locked: true,
        remainingAttempts: 0
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { 
      error: `Invalid email or password. ${remainingAttempts} attempt(s) remaining.`,
      remainingAttempts: remainingAttempts
    },
    { status: 401 }
  );
}

// ============================================================
// 🔑 HANDLE PASSWORD CHANGE
// ============================================================
async function handlePasswordChange(email, currentPassword, newPassword, confirmPassword) {
  console.log('🔑 Password change for:', email);

  // Get user from Supabase
  let user = null;
  let isFromSupabase = false;
  
  try {
    const dbUser = await getUserByEmail(email);
    if (dbUser) {
      isFromSupabase = true;
      user = {
        password: dbUser.password,
        name: dbUser.name,
        email: email,
        isFirstLogin: dbUser.is_first_login === 1
      };
    }
  } catch (dbError) {
    console.log('⚠️ Supabase lookup error:', dbError.message);
  }

  // Fallback to memory
  if (!user) {
    const memoryUser = users[email];
    if (memoryUser) {
      user = {
        password: memoryUser.password,
        name: memoryUser.name,
        email: email,
        isFirstLogin: memoryUser.isFirstLogin
      };
    }
  }

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Check if current password is correct
  let tempPassword = null;
  if (isFromSupabase) {
    tempPassword = await getTempPassword(email);
  }
  if (!tempPassword) {
    tempPassword = tempPasswords[email] || null;
  }
  
  const isValidCurrent = user.password === currentPassword || tempPassword === currentPassword;
  
  if (!isValidCurrent) {
    console.log('❌ Current password is incorrect');
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 401 }
    );
  }

  // Validate new password
  const validationErrors = validatePassword(newPassword, confirmPassword, currentPassword);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { errors: validationErrors },
      { status: 400 }
    );
  }

  // ✅ Update password
  if (isFromSupabase) {
    await updateUser(email, { 
      password: newPassword,
      is_first_login: 0,
      password_changed_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });
    await deleteTempPassword(email);
    console.log('✅ Password updated in Supabase for:', email);
  }

  // Also update memory
  if (users[email]) {
    users[email].password = newPassword;
    users[email].isFirstLogin = false;
    delete tempPasswords[email];
  }

  sendPasswordChangeEmail(email, user.name);

  return NextResponse.json({
    success: true,
    message: 'Password changed successfully! Please login with your new password.'
  });
}

// ============================================================
// 🔑 HANDLE FORGOT PASSWORD
// ============================================================
async function handleForgotPassword(email) {
  console.log('🔑 Forgot password for:', email);

  // Check if user exists in Supabase
  let user = null;
  let isFromSupabase = false;
  
  try {
    const dbUser = await getUserByEmail(email);
    if (dbUser) {
      isFromSupabase = true;
      user = dbUser;
    }
  } catch (dbError) {
    console.log('⚠️ Supabase lookup error:', dbError.message);
  }

  // Fallback to memory
  if (!user && !users[email]) {
    return NextResponse.json({
      success: true,
      message: 'If the email exists in our system, a password reset link has been sent.'
    });
  }

  if (!user) {
    user = users[email];
  }

  const tempPassword = generateTempPassword();

  // Save temp password
  if (isFromSupabase) {
    await setTempPassword(email, tempPassword);
    await updateUser(email, {
      is_first_login: 1,
      failed_attempts: 0,
      account_locked: 0,
      lock_time: null
    });
  }

  // Update memory
  if (users[email]) {
    tempPasswords[email] = tempPassword;
    users[email].isFirstLogin = true;
    users[email].failedAttempts = 0;
    users[email].accountLocked = false;
    users[email].lockTime = null;
  }

  sendPasswordResetEmail(email, user.name || 'Staff', tempPassword);

  return NextResponse.json({
    success: true,
    message: 'Password reset email sent!'
  });
}

// ============================================================
// 🛠️ VALIDATION
// ============================================================
function validatePassword(newPassword, confirmPassword, currentPassword) {
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