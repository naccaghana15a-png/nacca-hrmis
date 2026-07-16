import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Log the configuration (without exposing full password)
    console.log('📧 Testing email with:', {
      host: process.env.SMTP_HOST || 'not set',
      port: process.env.SMTP_PORT || 'not set',
      user: process.env.SMTP_USER || 'not set',
      passSet: process.env.SMTP_PASS ? '✅ Yes' : '❌ No',
    });

    // Check if credentials exist
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({
        success: false,
        error: 'SMTP credentials not configured. Please add SMTP_USER and SMTP_PASS to environment variables.',
      }, { status: 400 });
    }

    // Create transporter with proper config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Helps with some SSL issues
      },
    });

    // Verify connection first
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send test email
    const info = await transporter.sendMail({
      from: `"NaCCA HRMIS" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
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
              <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}</p>
              <p><strong>Port:</strong> ${process.env.SMTP_PORT || '587'}</p>
              <p><strong>User:</strong> ${process.env.SMTP_USER}</p>
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
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || '587',
        user: process.env.SMTP_USER,
      }
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      suggestions: [
        'Check if SMTP_HOST is correct (smtp.gmail.com)',
        'Check if SMTP_USER is your full Gmail address',
        'Check if SMTP_PASS is your App Password (16 characters, no spaces)',
        'Make sure you have enabled 2FA and created an App Password',
        'Check if your Gmail account has sending limits',
      ]
    }, { status: 500 });
  }
}