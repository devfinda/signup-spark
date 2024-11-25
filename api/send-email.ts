import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { emails } = req.body;

    const messages = emails.map((email: any) => ({
      to: email.to,
      from: 'notifications@signupspark.com',
      subject: email.subject,
      text: email.body,
      html: email.body.replace(/\n/g, '<br>'),
    }));

    await sgMail.send(messages);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send emails' });
  }
}