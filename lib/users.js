// lib/users.js - User database with temporary passwords

// Store all users
export const users = {};

// Store temporary passwords (for first-time login)
export const tempPasswords = {};

// Initialize with demo users
export function initDemoUsers() {
  // Super Admin
  users['admin@nacca.gov.gh'] = {
    password: 'Admin@123',
    name: 'System Administrator',
    role: 'SUPER_ADMIN',
    staffId: 'NAC-IT-0001',
    department: 'ICT',
    isFirstLogin: false,
    passwordChangedAt: '2026-01-01 00:00:00',
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-12 10:00:00'
  };

  // Directors
  users['director@nacca.gov.gh'] = {
    password: 'Director@123',
    name: 'Reginald George Quartey',
    role: 'DIRECTOR',
    staffId: 'NAC-CD-0001',
    department: 'Curriculum',
    isFirstLogin: false,
    passwordChangedAt: '2026-06-15 09:00:00',
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-11 14:30:00'
  };

  users['hr@nacca.gov.gh'] = {
    password: 'Hr@123',
    name: 'Elijah Intsiful',
    role: 'DIRECTOR',
    staffId: 'NAC-HR-0001',
    department: 'Human Resource',
    isFirstLogin: false,
    passwordChangedAt: '2026-07-01 09:00:00',
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: '2026-07-11 16:00:00'
  };

  // Staff (first login enabled)
  users['staff@nacca.gov.gh'] = {
    password: null,
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
  };
  tempPasswords['staff@nacca.gov.gh'] = 'Temp@2026';
}

// Function to create a new staff account
export function createStaffAccount(email, name, staffId, department, role = 'STAFF') {
  if (users[email]) {
    return { success: false, error: 'User already exists' };
  }

  const tempPassword = generateTempPassword();

  users[email] = {
    password: null,
    name: name,
    role: role,
    staffId: staffId,
    department: department,
    isFirstLogin: true,
    passwordChangedAt: null,
    passwordHistory: [],
    accountLocked: false,
    failedAttempts: 0,
    lastLogin: null
  };

  tempPasswords[email] = tempPassword;

  return {
    success: true,
    tempPassword: tempPassword,
    user: users[email]
  };
}

// Function to change password
export function changePassword(email, newPassword) {
  if (!users[email]) {
    return { success: false, error: 'User not found' };
  }

  users[email].password = newPassword;
  users[email].isFirstLogin = false;
  users[email].passwordChangedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  users[email].passwordHistory.push('hashed_old_password');
  if (users[email].passwordHistory.length > 5) {
    users[email].passwordHistory.shift();
  }

  delete tempPasswords[email];

  return { success: true };
}

// Function to reset password (forgot password)
export function resetPassword(email) {
  if (!users[email]) {
    return { success: false, error: 'User not found' };
  }

  const tempPassword = generateTempPassword();
  tempPasswords[email] = tempPassword;
  users[email].isFirstLogin = true;

  return { success: true, tempPassword: tempPassword };
}

// Generate temporary password
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
