import { NextResponse } from 'next/server';
import { users, tempPasswords } from '../../../lib/users';

export async function GET() {
  // ✅ Force reset admin user
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

  // ✅ Also ensure demo director exists
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

  // ✅ Also ensure HR director exists
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

  // ✅ Remove any temp passwords for these users
  delete tempPasswords['admin@nacca.gov.gh'];
  delete tempPasswords['director@nacca.gov.gh'];
  delete tempPasswords['hr@nacca.gov.gh'];

  return NextResponse.json({
    success: true,
    message: 'Admin password reset to Admin@123',
    adminExists: !!users['admin@nacca.gov.gh'],
    totalUsers: Object.keys(users).length,
    userList: Object.keys(users).slice(0, 5)
  });
}