import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return NextResponse.json({
        success: false,
        error: 'SMTP credentials not configured.',
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // ✅ Send to a different email address for testing
    const testEmail = 'YOUR_OTHER_EMAIL@example.com'; // Change this to a different email

    const info = await transporter.sendMail({
      from: `"NaCCA HRMIS" <${user}>`,
      to: testEmail, // Send to a different email
      subject: '✅ Email Test - NaCCA HRMIS',
      html: `
        <h1>✅ Email is Working!</h1>
        <p>This is a test email from NaCCA HRMIS.</p>
        <p><strong>From:</strong> ${user}</p>
        <p><strong>To:</strong> ${testEmail}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this, email is configured correctly!</p>
      `,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: `Test email sent to ${testEmail}! Check your inbox.`,
      from: user,
      to: testEmail,
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}