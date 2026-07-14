import { NextResponse } from 'next/server';
import { users, tempPasswords, createStaffAccount } from '../../../../lib/users';

// ============================================================
// 📧 EMAIL FUNCTION (Logs to console, no SMTP needed)
// ============================================================
function sendPasswordEmail(email, name, tempPassword) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    📧 PASSWORD EMAIL                        ║
╠══════════════════════════════════════════════════════════════╣
║ To: ${email.padEnd(50)}║
║ From: noreply@nacca.gov.gh                                  ║
║ Subject: Your NaCCA HRMIS Account Credentials              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║ Dear ${name},                                               ║
║                                                              ║
║ Your account has been created successfully.                  ║
║                                                              ║
║ 🔑 Temporary Password: ${tempPassword}                      ║
║                                                              ║
║ IMPORTANT: Please login with this temporary password        ║
║ and change it immediately.                                  ║
║                                                              ║
║ Login URL: https://nacca-hrmis.vercel.app                   ║
║                                                              ║
║ If you have any issues, please contact HR.                  ║
║                                                              ║
║ Regards,                                                     ║
║ NaCCA HRMIS System                                           ║
╚══════════════════════════════════════════════════════════════╝
  `);
  return { success: true, method: 'console' };
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
// 📝 CREATE ACCOUNT API
// ============================================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, staffId, department, role = 'STAFF' } = body;

    console.log('📝 Creating account for:', email);

    if (!email || !name || !staffId || !department) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already has a password (actual account)
    if (users[email] && users[email].password !== null) {
      return NextResponse.json(
        { 
          error: 'User already has an account',
          message: 'This employee already has a login account with a password.'
        },
        { status: 400 }
      );
    }

    // If user exists but has no password, update them
    if (users[email] && users[email].password === null) {
      const tempPassword = generateTempPassword();
      
      users[email].password = null; // Keep as null for first login
      users[email].isFirstLogin = true;
      tempPasswords[email] = tempPassword;

      // Send password via email (logs to console)
      sendPasswordEmail(email, name, tempPassword);

      // ✅ Return the password so it shows in the alert
      return NextResponse.json({
        success: true,
        message: 'Account created successfully.',
        tempPassword: tempPassword,  // ← This is the key!
        user: users[email]
      });
    }

    // Create new account if user doesn't exist
    const result = createStaffAccount(email, name, staffId, department, role);
    console.log('✅ Result:', result);

    if (result.success) {
      sendPasswordEmail(email, name, result.tempPassword);

      // ✅ Return the password so it shows in the alert
      return NextResponse.json({
        success: true,
        message: 'Account created successfully.',
        tempPassword: result.tempPassword,  // ← This is the key!
        user: {
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          staffId: result.user.staffId
        }
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