import { NextResponse } from 'next/server';
import { users, tempPasswords, createStaffAccount } from '../../../../lib/users';
import nodemailer from 'nodemailer';

// ============================================================
// 📧 EMAIL CONFIGURATION
// ============================================================

// Create email transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.SMTP_HOST?.includes('gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // For custom SMTP (corporate)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.nacca.gov.gh',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'noreply@nacca.gov.gh',
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send password email
async function sendPasswordEmail(email, name, tempPassword) {
  try {
    // If no email config, log to console
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
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
║ 🔑 Temporary Password: ${tempPassword}                      ║
║                                                              ║
║ Login: https://nacca-hrmis.vercel.app                       ║
║                                                              ║
║ ⚠️ Please change your password on first login.              ║
╚══════════════════════════════════════════════════════════════╝
      `);
      return { success: true, method: 'console' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"NaCCA HRMIS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to NaCCA HRMIS - Your Account Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0056A3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .password-box { background: white; border: 2px dashed #0056A3; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .password { font-size: 24px; font-weight: bold; color: #0056A3; letter-spacing: 2px; }
            .button { display: inline-block; background: #0056A3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 15px 0; }
            ul { margin: 10px 0; padding-left: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏛️ NaCCA HRMIS</h1>
              <p>Human Resource Management Information System</p>
            </div>
            <div class="content">
              <h2>Welcome, ${name}!</h2>
              <p>Your account has been created successfully in the NaCCA HRMIS system.</p>
              
              <div class="password-box">
                <p style="margin-bottom: 10px; font-weight: bold;">🔑 Your Temporary Password</p>
                <div class="password">${tempPassword}</div>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">This password is case-sensitive</p>
              </div>
              
              <div class="warning">
                <p style="font-weight: bold; color: #856404;">⚠️ IMPORTANT:</p>
                <ul>
                  <li>This is a <strong>temporary password</strong>. You must change it on first login.</li>
                  <li>Do not share this password with anyone.</li>
                  <li>For security, you will be prompted to change your password every 90 days.</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="https://nacca-hrmis.vercel.app" class="button">🔐 Login to HRMIS</a>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 6px;">
                <p style="margin: 0; font-size: 14px;"><strong>📋 Password Requirements:</strong></p>
                <ul style="margin: 5px 0; padding-left: 20px; font-size: 13px;">
                  <li>Minimum 8 characters</li>
                  <li>At least one uppercase and one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character (!@#$%^&*)</li>
                </ul>
              </div>
              
              <p style="margin-top: 20px;">If you have any issues, please contact the HR Department.</p>
              <p>Regards,<br><strong>NaCCA HRMIS Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message from NaCCA HRMIS. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} National Council for Curriculum and Assessment (NaCCA)</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to NaCCA HRMIS!

        Dear ${name},

        Your account has been created successfully.

        🔑 Temporary Password: ${tempPassword}

        ⚠️ IMPORTANT:
        - This is a temporary password. You must change it on first login.
        - Do not share this password with anyone.
        - You will be prompted to change your password every 90 days.

        Login URL: https://nacca-hrmis.vercel.app

        Password Requirements:
        - Minimum 8 characters
        - At least one uppercase and one lowercase letter
        - At least one number
        - At least one special character (!@#$%^&*)

        If you have any issues, please contact the HR Department.

        Regards,
        NaCCA HRMIS Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, method: 'smtp', messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Email error:', error);
    
    // Fallback: Log to console
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         ⚠️ EMAIL FAILED - FALLBACK TO CONSOLE              ║
╠══════════════════════════════════════════════════════════════╣
║ To: ${email.padEnd(50)}║
║ 🔑 Temporary Password: ${tempPassword}                      ║
╚══════════════════════════════════════════════════════════════╝
    `);
    
    return { success: false, method: 'fallback', error: error.message };
  }
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

    // Check if user already has a REAL password
    if (users[email] && users[email].password !== null) {
      return NextResponse.json(
        { 
          error: 'User already has an account',
          message: 'This employee already has a login account with a password.'
        },
        { status: 400 }
      );
    }

    // Create or update account
    const result = createStaffAccount(email, name, staffId, department, role);
    console.log('✅ Result:', result);

    if (result.success) {
      // ✅ SEND EMAIL
      const emailResult = await sendPasswordEmail(email, name, result.tempPassword);

      return NextResponse.json({
        success: true,
        message: emailResult.success 
          ? 'Account created. Password sent to email.' 
          : 'Account created but email failed. Check SMTP settings.',
        tempPassword: result.tempPassword,
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