import { NextResponse } from 'next/server';
import { users, tempPasswords, createStaffAccount } from '../../../lib/users';

// ============================================================
// 📧 EMAIL FUNCTION (Logs to console for now)
// ============================================================
function sendPasswordEmail(email, name, tempPassword) {
  // This will appear in your Vercel logs or terminal
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
  
  // ✅ In production, replace this with actual email sending:
  // Example using nodemailer, SendGrid, AWS SES, etc.
  /*
  const transporter = nodemailer.createTransport({
    host: 'smtp.nacca.gov.gh',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transporter.sendMail({
    from: 'noreply@nacca.gov.gh',
    to: email,
    subject: 'Your NaCCA HRMIS Account Credentials',
    html: `
      <h2>Welcome to NaCCA HRMIS!</h2>
      <p>Dear ${name},</p>
      <p>Your account has been created successfully.</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p><strong>IMPORTANT:</strong> Please login and change your password immediately.</p>
      <p><a href="https://nacca-hrmis.vercel.app">Login Here</a></p>
      <p>Regards,<br>NaCCA HRMIS System</p>
    `
  });
  */
  
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

    const result = createStaffAccount(email, name, staffId, department, role);
    console.log('✅ Result:', result);

    if (result.success) {
      // ✅ Send password via email (logs to console for now)
      sendPasswordEmail(email, name, result.tempPassword);

      // ⚠️ DO NOT return the password to the client
      return NextResponse.json({
        success: true,
        message: 'Account created successfully. Password sent to email.',
        user: {
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          staffId: result.user.staffId
        }
        // ❌ tempPassword is NOT included here - security!
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
