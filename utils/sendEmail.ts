import nodemailer from 'nodemailer';

// Create reusable transporter using SMTP from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email utility
 * @param to Recipient email
 * @param subject Email subject
 * @param text Plain text email content
 * @param html Optional HTML content
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, 
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (err: unknown) {
    console.error('Error sending email:', err);
    throw err;
  }
}
