import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: 'postmaster@sandbox18300d1ee69c4205b4f1dc1972e9aeb2.mailgun.org',
    pass: '095b998614365ecf09eaeef620244cac-c02fd0ba-8e3e66c3',
  },
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { emails } = JSON.parse(event.body || '{}');

    // Send emails in parallel
    await Promise.all(emails.map(async (email: any) => {
      await transporter.sendMail({
        from: '"SignupSpark" <notifications@signupspark.com>',
        to: email.to,
        subject: email.subject,
        text: email.body,
        html: email.body.replace(/\n/g, '<br>'),
      });
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send emails' }),
    };
  }
};

export { handler };