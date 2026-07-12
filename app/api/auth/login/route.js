import { NextResponse } from 'next/server';

// User database with password management
const USERS = {
  // Super Admin
  'admin@nacca.gov.gh': {
    password: '$2b$10$hashed_password_here', // In production, use bcrypt
    name: 'System Administrator',
    role: 'SUPER_ADMIN',
    staffId: 'NAC-IT-0001',
    department: 'ICT',
    isFirstLogin: false,
    passwordChangedAt: '2026-01-01 00:00:00',
    passwordHistory: ['old_hash_1', 'old_hash_2'],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-12 10:00:00'
  },
  // Directors
  'director@nacca.gov.gh': {
    password: '$2b$10$hashed_password_here',
    name: 'Reginald George Quartey',
    role: 'DIRECTOR',
    staffId: 'NAC-CD-0001',
    department: 'Curriculum',
    isFirstLogin: true,
    passwordChangedAt: null,
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: null
  },
  'hr@nacca.gov.gh': {
    password: '$2b$10$hashed_password_here',
    name: 'Elijah Intsiful',
    role: 'DIRECTOR',
    staffId: 'NAC-HR-0001',
    department: 'Human Resource',
    isFirstLogin: false,
    passwordChangedAt: '2026-07-01 09:00:00',
    passwordHistory: ['old_hash_1'],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-11 16:00:00'
  },
  // Staff
  'staff@nacca.gov.gh': {
    password: '$2b$10$hashed_password_here',
    name: 'Genevieve Mensah',
    role: 'STAFF',
    staffId: 'NAC-CD-0002',
    department: 'Curriculum',
    isFirstLogin: true,
    passwordChangedAt: null,
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: null
  }
};

// Temporary passwords for first-time login (in production, store hashed)
const TEMP_PASSWORDS = {
  'director@nacca.gov.gh': 'Temp@2026',
  'staff@nacca.gov.gh': 'Temp@2026'
};

// Audit log for password activities
let passwordAuditLog = [];

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

// Handle Login
async function handleLogin(email, password) {
  const user = USERS[email];
  
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

  // For demo, check password directly (in production, use bcrypt compare)
  // This is a simplified check - in production use bcrypt
  const isValidPassword = password === 'Admin@123' || password === 'Director@123' || password === 'Hr@123' || password === 'Staff@123';

  // Check temporary password for first-time login
  const isTempPassword = TEMP_PASSWORDS[email] === password;

  if (!isValidPassword && !isTempPassword) {
    // Increment failed attempts
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    
    // Lock account after 5 failed attempts
    if (user.failedAttempts >= 5) {
      user.accountLocked = true;
      // Log the lock
      logPasswordActivity(email, 'ACCOUNT_LOCKED', 'Account locked due to 5 failed login attempts');
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

  // Reset failed attempts on successful login
  user.failedAttempts = 0;
  user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Check if first-time login (using temporary password)
  const isFirstLogin = TEMP_PASSWORDS[email] === password;

  // Create response
  const response = NextResponse.json({
    success: true,
    isFirstLogin: isFirstLogin,
    user: {
      email: email,
      name: user.name,
      role: user.role,
      staffId: user.staffId,
      department: user.department
    },
    requiresPasswordChange: isFirstLogin
  });

  // Set cookie
  response.cookies.set('auth_user', JSON.stringify({
    email: email,
    name: user.name,
    role: user.role,
    staffId: user.staffId,
    department: user.department,
    isFirstLogin: isFirstLogin
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  // Log successful login
  logPasswordActivity(email, 'LOGIN_SUCCESS', 'Successful login');

  return response;
}

// Handle Password Change (First Login)
async function handlePasswordChange(email, currentPassword, newPassword, confirmPassword) {
  const user = USERS[email];
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
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

  // Update password (in production, hash with bcrypt)
  // user.password = await bcrypt.hash(newPassword, 10);
  
  // Update user record
  user.isFirstLogin = false;
  user.passwordChangedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  
  // Add to password history (keep last 5)
  user.passwordHistory.unshift('hashed_old_password');
  if (user.passwordHistory.length > 5) {
    user.passwordHistory.pop();
  }

  // Remove temporary password
  delete TEMP_PASSWORDS[email];

  // Log password change
  logPasswordActivity(email, 'PASSWORD_CHANGED', 'Password changed successfully (first login)');

  return NextResponse.json({
    success: true,
    message: 'Password changed successfully! Please login with your new password.'
  });
}

// Handle Forgot Password
async function handleForgotPassword(email) {
  const user = USERS[email];
  
  if (!user) {
    // Don't reveal if user exists for security
    return NextResponse.json({
      success: true,
      message: 'If the email exists in our system, a password reset link has been sent.'
    });
  }

  // Generate temporary password
  const tempPassword = generateTempPassword();
  TEMP_PASSWORDS[email] = tempPassword;
  user.isFirstLogin = true;

  // Log password reset
  logPasswordActivity(email, 'PASSWORD_RESET_REQUESTED', 'Password reset requested');

  // In production, send email with reset link/temporary password
  console.log(`📧 Password reset for ${email}:`);
  console.log(`Temporary password: ${tempPassword}`);
  console.log(`Please login with this temporary password and change it immediately.`);

  // Send email notification (simulated)
  sendPasswordResetEmail(email, user.name, tempPassword);

  return NextResponse.json({
    success: true,
    message: 'If the email exists in our system, a password reset link has been sent.'
  });
}

// Validate Password
function validatePassword(newPassword, confirmPassword, currentPassword, user) {
  const errors = [];

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    errors.push('Passwords do not match.');
  }

  // Check minimum length
  if (newPassword.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  // Check for uppercase
  if (!/[A-Z]/.test(newPassword)) {
    errors.push('Password must contain at least one uppercase letter.');
  }

  // Check for lowercase
  if (!/[a-z]/.test(newPassword)) {
    errors.push('Password must contain at least one lowercase letter.');
  }

  // Check for numbers
  if (!/[0-9]/.test(newPassword)) {
    errors.push('Password must contain at least one number.');
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
    errors.push('Password must contain at least one special character (!@#$%^&*).');
  }

  // Check if same as temporary password
  if (currentPassword === newPassword) {
    errors.push('New password cannot be the same as the temporary password.');
  }

  // Check password history (last 5 passwords)
  if (user.passwordHistory && user.passwordHistory.length > 0) {
    // In production, compare hashes
    // if (user.passwordHistory.includes(await bcrypt.hash(newPassword, 10))) {
    //   errors.push('Password has been used recently. Please choose a different password.');
    // }
  }

  return errors;
}

// Generate Temporary Password
function generateTempPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()';
  
  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill rest with random characters
  const all = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < 10; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  
  return password;
}

// Log Password Activity
function logPasswordActivity(email, action, details) {
  passwordAuditLog.unshift({
    id: passwordAuditLog.length + 1,
    email: email,
    action: action,
    details: details,
    ip: '192.168.1.100', // In production, get from request
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
  });

  // Keep last 1000 logs
  if (passwordAuditLog.length > 1000) {
    passwordAuditLog.pop();
  }
}

// Send Password Reset Email (Simulated)
function sendPasswordResetEmail(email, name, tempPassword) {
  console.log(`
    ========================================
    📧 PASSWORD RESET EMAIL
    ========================================
    To: ${email}
    From: noreply@nacca.gov.gh
    Subject: Password Reset - NaCCA HRMIS
    
    Dear ${name},
    
    You have requested a password reset for your NaCCA HRMIS account.
    
    Your temporary password is: ${tempPassword}
    
    IMPORTANT: Please login with this temporary password and change it immediately.
    This temporary password will expire after first use.
    
    If you did not request this reset, please contact HR immediately.
    
    Regards,
    NaCCA HRMIS System
    ========================================
  `);
}

// Get Password Audit Log (for admin)
export async function GET(request) {
  // Check if user is admin (in production, verify token/role)
  return NextResponse.json({
    logs: passwordAuditLog
  });
}