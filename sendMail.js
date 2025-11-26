// sendMail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const host = process.env.EMAIL_HOST || 'smtp.mailtrap.io';
const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 2525;
const secure = (process.env.EMAIL_SECURE === 'true'); // mailtrap => false
const user = process.env.EMAIL_USER || process.env.EMAIL;
const pass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass
  }
});

// optional: verify connection at startup
transporter.verify()
  .then(() => console.log('Mail transporter verified (SMTP OK)'))
  .catch(err => console.error('Mail transporter verify failed:', err.message));

module.exports = async function sendMail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: `"Ayush Cafe" <${process.env.EMAIL || user}>`,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent:', { messageId: info.messageId, accepted: info.accepted });
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};
