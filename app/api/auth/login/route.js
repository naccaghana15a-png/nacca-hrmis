import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { users, tempPasswords, initDemoUsers } from '../../../../lib/users';

// Initialize demo users (for fallback)
initDemoUsers();

// ============================================================
// 📧 EMAIL FUNCTIONS (for notifications)
// ============================================================
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
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// ============================================================
// 🔑 HANDLE LOGIN
// ============================================================
async function handleLogin(email, password) {
  console.log('🔍 Login attempt for:', email);

  // ✅ FIRST: Try to get user from Supabase
  let user = null;
  let userFromDB = null;
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!error && data) {
      userFromDB = data;
      console.log('✅ User found in Supabase:', email);
    }
  } catch (dbError) {
    console.log('⚠️ Supabase lookup failed:', dbError.message);
  }

  // ✅ SECOND: Check in-memory users as fallback
  const memoryUser = users[email];
  
  // Use Supabase data if available, otherwise use memory
  if (userFromDB) {
    user = {
      password: userFromDB.password,
      name: userFromDB.name,
      role: userFromDB.role,
      staffId: userFromDB.staff_id,
      department: userFromDB.department,
      isFirstLogin: userFromDB.is_first_login === 1,
      accountLocked: userFromDB.account_locked === 1,
      failedAttempts: userFromDB.failed_attempts || 0,
      lockTime: userFromDB.lock_time,
      lastLogin: userFromDB.last_login,
      email: email
    };
  } else if (memoryUser) {
    user = memoryUser;
    console.log('✅ Using memory user:', email);
  } else {
    console.log('❌ User not found:', email);
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // ✅ Check if account is locked
  if (user.accountLocked) {
    const lockTime = user.lockTime || 0;
    const now = Date.now();
    const lockDuration = 30 * 60 * 1000;

    if (now - lockTime > lockDuration) {
      // Auto-unlock
      user.accountLocked = false;
      user.failedAttempts = 0;
      user.lockTime = null;
      await updateUserInSupabase(email, { 
        account_locked: 0, 
        failed_attempts: 0, 
        lock_time: null 
      });
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

  // ✅ Check temp password (for first-time login)
  const tempPassword = await getTempPasswordFromDB(email);
  const isTempPassword = tempPassword === password;
  const isValidPassword = user.password === password;

  console.log('🔍 isTempPassword:', isTempPassword);
  console.log('🔍 isValidPassword:', isValidPassword);
  console.log('🔍 isFirstLogin:', user.isFirstLogin);

  // ✅ First-time login with temporary password
  if (user.isFirstLogin && isTempPassword) {
    console.log('✅ First-time login with temp password for:', email);
    user.failedAttempts = 0;
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);
    await updateUserInSupabase(email, { 
      failed_attempts: 0, 
      last_login: user.lastLogin 
    });

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

    await updateUserInSupabase(email, { 
      failed_attempts: 0, 
      account_locked: 0, 
      lock_time: null,
      last_login: user.lastLogin,
      is_first_login: 0 
    });

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

  // ❌ Invalid password - increment attempts
  console.log('❌ Invalid password for:', email);
  user.failedAttempts = (user.failedAttempts || 0) + 1;
  const remainingAttempts = 5 - user.failedAttempts;

  await updateUserInSupabase(email, { 
    failed_attempts: user.failedAttempts 
  });

  if (user.failedAttempts >= 5) {
    user.accountLocked = true;
    user.lockTime = Date.now();
    await updateUserInSupabase(email, { 
      account_locked: 1, 
      lock_time: new Date().toISOString().replace('T', ' ').slice(0, 19) 
    });
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
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!error && data) {
      user = data;
    }
  } catch (dbError) {
    console.log('⚠️ Supabase lookup failed:', dbError.message);
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
  const tempPassword = await getTempPasswordFromDB(email);
  const isValidCurrent = user.password === currentPassword || tempPassword === currentPassword;
  
  if (!isValidCurrent) {
    console.log('❌ Current password is incorrect');
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

  // ✅ Update password in Supabase
  try {
    const { error } = await supabase
      .from('employees')
      .update({ 
        password: newPassword,
        is_first_login: 0,
        password_changed_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      })
      .eq('email', email);
    
    if (error) throw error;
    console.log('✅ Password updated in Supabase for:', email);
  } catch (dbError) {
    console.log('⚠️ Could not update Supabase:', dbError.message);
  }

  // Also update memory
  if (users[email]) {
    users[email].password = newPassword;
    users[email].isFirstLogin = false;
    delete tempPasswords[email];
  }

  // Delete temp password
  await deleteTempPasswordFromDB(email);

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

  // Check if user exists
  let user = null;
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!error && data) {
      user = data;
    }
  } catch (dbError) {
    console.log('⚠️ Supabase lookup failed:', dbError.message);
  }

  if (!user && !users[email]) {
    return NextResponse.json({
      success: true,
      message: 'If the email exists in our system, a password reset link has been sent.'
    });
  }

  const tempPassword = generateTempPassword();

  // Save temp password to Supabase
  await setTempPasswordInDB(email, tempPassword);

  // Reset user
  if (users[email]) {
    users[email].isFirstLogin = true;
    users[email].failedAttempts = 0;
    users[email].accountLocked = false;
    users[email].lockTime = null;
  }

  // Update Supabase
  await updateUserInSupabase(email, {
    is_first_login: 1,
    failed_attempts: 0,
    account_locked: 0,
    lock_time: null
  });

  sendPasswordResetEmail(email, user?.name || 'Staff', tempPassword);

  return NextResponse.json({
    success: true,
    message: 'Password reset email sent!'
  });
}

// ============================================================
// 🛠️ HELPER FUNCTIONS
// ============================================================

async function getTempPasswordFromDB(email) {
  try {
    const { data, error } = await supabase
      .from('temp_passwords')
      .select('temp_password')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data?.temp_password || null;
  } catch (error) {
    return null;
  }
}

async function setTempPasswordInDB(email, tempPassword) {
  try {
    const { error } = await supabase
      .from('temp_passwords')
      .upsert({ 
        email: email, 
        temp_password: tempPassword,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.log('⚠️ Could not save temp password:', error.message);
    return false;
  }
}

async function deleteTempPasswordFromDB(email) {
  try {
    const { error } = await supabase
      .from('temp_passwords')
      .delete()
      .eq('email', email);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.log('⚠️ Could not delete temp password:', error.message);
    return false;
  }
}

async function updateUserInSupabase(email, updates) {
  try {
    const { error } = await supabase
      .from('employees')
      .update(updates)
      .eq('email', email);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.log('⚠️ Could not update user:', error.message);
    return false;
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