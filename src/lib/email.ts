import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to?: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return;
  }
  const info = await transporter.sendMail({
    from: `"Avaldao SGR" <${process.env.SMTP_USER}>`,
    to: to ,
    subject: subject,
    text: text,
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  
  return info;
}