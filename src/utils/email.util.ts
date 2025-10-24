import nodemailer from 'nodemailer';
import { NODEMAILEREMAIL, NODEMAILERPASSWORD } from '../config/env';
import { BadrequestError } from './errors/badRequest.error';
import { SendEmailOptions } from '../types/type';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: NODEMAILEREMAIL,
    pass: NODEMAILERPASSWORD,
  },
});


export const sendEmail = async ({ to, subject, html, text }: SendEmailOptions) => {
  if (!to) throw new BadrequestError('Recipient email is required');
  if (!subject) throw new BadrequestError('Email subject is required');
  if (!html && !text) throw new BadrequestError('Email content is required');

  const mailOptions = {
    from: NODEMAILEREMAIL,
    to,
    subject,
    html,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error('Error sending email:', err);
    throw new BadrequestError('Error sending email');
  }
};
