import env from "../utils/validateEnv";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465 (SSL)
  auth: {
    user: `${env.EMAIL_USER}`,
    pass: `${env.EMAIL_PASS}`,
  },
});

/**
 * Send an email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 */
export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
  const info = await transporter.sendMail({
    from: `Admin <${env.EMAIL_USER}>`, // sender address
    to,
    subject,
    text,
    html,
  });
  return info;
}