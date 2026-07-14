import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.nacca.gov.gh',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"NaCCA HRMIS Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: 'Test Email from NaCCA HRMIS',
      html: '<h1>✅ Email is working!</h1><p>This is a test email from NaCCA HRMIS.</p>',
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Test email sent successfully!',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}