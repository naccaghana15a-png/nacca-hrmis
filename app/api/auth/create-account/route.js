import { NextResponse } from 'next/server';
import { users, tempPasswords, createStaffAccount } from '../../../../lib/users';

// ============================================================
// 📝 CREATE ACCOUNT API
// ============================================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, staffId, department, role = 'STAFF' } = body;

    console.log('📝 Creating account for:', email);
    console.log('📊 User data:', { email, name, staffId, department, role });

    if (!email || !name || !staffId || !department) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ✅ Check if user already has a REAL password (not null)
    if (users[email] && users[email].password !== null) {
      return NextResponse.json(
        { 
          error: 'User already has an account',
          message: 'This employee already has a login account with a password.'
        },
        { status: 400 }
      );
    }

    // ✅ If user exists but has NO password (isFirstLogin), update them
    if (users[email] && users[email].password === null) {
      // Generate a new temporary password
      const tempPassword = generateTempPassword();
      
      // Update existing user
      users[email].name = name;
      users[email].role = role;
      users[email].staffId = staffId;
      users[email].department = department;
      users[email].isFirstLogin = true;
      users[email].password = null;
      tempPasswords[email] = tempPassword;
      
      console.log('✅ Updated existing account for:', email);
      console.log('🔑 Temporary password:', tempPassword);

      return NextResponse.json({
        success: true,
        message: 'Account updated successfully',
        tempPassword: tempPassword,
        user: users[email]
      });
    }

    // ✅ Create NEW account if user doesn't exist at all
    const result = createStaffAccount(email, name, staffId, department, role);
    console.log('✅ Result:', result);

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
    console.error('❌ Create account error:', error);
    return NextResponse.json(
      { error: 'Failed to create account: ' + error.message },
      { status: 500 }
    );
  }
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