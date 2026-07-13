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
// POST - Add new employee
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📝 Received data:', body);

    const { email, name, staffId, department, position, status, joinDate } = body;

    // Validate required fields
    const errors = [];
    if (!email) errors.push('Email is required');
    if (!name) errors.push('Name is required');
    if (!department) errors.push('Department is required');
    if (!position) errors.push('Position is required');

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields: ' + errors.join(', ') },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users[email]) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 400 }
      );
    }

    // Generate staff ID if not provided
    const newStaffId = staffId || `NAC-${String(Object.keys(users).length + 1).padStart(4, '0')}`;
    const tempPassword = generateTempPassword();

    // Create user in database
    users[email] = {
      password: null,
      name: name,
      role: position || 'STAFF',
      staffId: newStaffId,
      department: department || 'N/A',
      isFirstLogin: true,
      passwordChangedAt: null,
      passwordHistory: [],
      accountLocked: false,
      failedAttempts: 0,
      lastLogin: null
    };

    tempPasswords[email] = tempPassword;

    console.log('✅ Employee added successfully:', { email, name, newStaffId });

    return NextResponse.json({
      success: true,
      message: 'Employee added successfully',
      tempPassword: tempPassword,
      employee: {
        email,
        name,
        staffId: newStaffId,
        department: department || 'N/A',
        position: position || 'STAFF',
        status: status || 'Active',
        joinDate: joinDate || new Date().toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('❌ Error adding employee:', error);
    return NextResponse.json(
      { error: 'Failed to add employee: ' + error.message },
      { status: 500 }
    );
  }
}