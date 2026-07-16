import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // ✅ Use environment variables directly (no fallbacks that override)
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Log the configuration (without exposing full password)
    console.log('📧 Testing email with:', {
      host: host,
      port: port,
      user: user,
      passSet: pass ? '✅ Yes' : '❌ No',
    });

    // Check if credentials exist
    if (!user || !pass) {
      return NextResponse.json({
        success: false,
        error: 'SMTP credentials not configured. Please add SMTP_USER and SMTP_PASS to environment variables.',
        config: {
          host: host || 'not set',
          user: user || 'not set',
        }
      }, { status: 400 });
    }

    // ✅ Use Gmail service directly (more reliable)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send test email
    const info = await transporter.sendMail({
      from: `"NaCCA HRMIS" <${user}>`,
      to: user,
      subject: '✅ Email Test - NaCCA HRMIS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0056A3; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { padding: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏛️ NaCCA HRMIS</h1>
              <p>Email Test</p>
            </div>
            <div class="content">
              <h2>✅ Email is Working!</h2>
              <p>This is a test email from NaCCA HRMIS.</p>
              <p><strong>SMTP Host:</strong> Gmail (service)</p>
              <p><strong>User:</strong> ${user}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p>If you received this, email is configured correctly!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} National Council for Curriculum and Assessment (NaCCA)</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully! Message ID:', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Test email sent successfully! Check your inbox.',
      config: {
        host: 'smtp.gmail.com (service)',
        user: user,
      }
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      suggestions: [
        'Make sure SMTP_USER is your full Gmail address: naccaghana15a@gmail.com',
        'Make sure SMTP_PASS is your App Password (16 characters, no spaces)',
        'You may need to create a new App Password at: https://myaccount.google.com/apppasswords',
        'Make sure 2-Factor Authentication is enabled on your Gmail account',
      ]
    }, { status: 500 });
  }
}