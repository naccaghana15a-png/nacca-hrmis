import { NextResponse } from 'next/server';
import { users, tempPasswords, createStaffAccount } from '../../../lib/users';

// ============================================================
// 📧 EMAIL FUNCTION (Logs to console for now)
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
  return true;
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

    // Check if user already exists
    if (users[email]) {
      return NextResponse.json(
        { 
          error: 'User already exists', 
          message: 'This employee already has an account.'
        },
        { status: 400 }
      );
    }

    // Create the account using the function from lib/users.js
    const result = createStaffAccount(email, name, staffId, department, role);
    console.log('✅ Result:', result);

    if (result.success) {
      // Send password via email
      sendPasswordEmail(email, name, result.tempPassword);

      return NextResponse.json({
        success: true,
        message: 'Account created successfully. Password sent to email.',
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