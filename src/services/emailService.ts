import { Campaign } from '../store/campaignStore';
import { Task } from '../types/task';

const getTaskSignupEmailTemplate = (
  campaign: Campaign,
  task: Task,
  participantName: string
): { subject: string; body: string } => ({
  subject: `New Task Signup: ${campaign.name}`,
  body: `
    Hello,

    ${participantName} has signed up for the task "${task.name}" in your campaign "${campaign.name}".

    Task Details:
    - Name: ${task.name}
    - Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not specified'}
    ${task.quantity ? `- Quantity: ${task.quantity}` : ''}
    
    Participant Details:
    - Name: ${participantName}
    - Email: ${task.assignedEmail}
    ${task.assignedPhone ? `- Phone: ${task.assignedPhone}` : ''}

    You can view the campaign progress at: ${window.location.origin}/campaign/${campaign.code}

    Best regards,
    SignupSpark Team
  `,
});

const getParticipantConfirmationTemplate = (
  campaign: Campaign,
  task: Task
): { subject: string; body: string } => ({
  subject: `Task Confirmation: ${campaign.name}`,
  body: `
    Hello ${task.assignedTo},

    Thank you for signing up for a task in the campaign "${campaign.name}".

    Your Task Details:
    - Task: ${task.name}
    - Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not specified'}
    ${task.quantity ? `- Quantity: ${task.quantity}` : ''}

    You can view or update your task at: ${window.location.origin}/campaign/${campaign.code}

    If you need to make any changes or have questions, please contact the campaign organizer.

    Best regards,
    SignupSpark Team
  `,
});

export const sendTaskSignupEmails = async (
  campaign: Campaign,
  task: Task,
  organizerEmail: string
) => {
  if (!task.assignedTo || !task.assignedEmail) return;

  try {
    const organizerEmailTemplate = getTaskSignupEmailTemplate(campaign, task, task.assignedTo);
    const participantEmailTemplate = getParticipantConfirmationTemplate(campaign, task);

    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emails: [
          {
            to: organizerEmail,
            subject: organizerEmailTemplate.subject,
            body: organizerEmailTemplate.body,
          },
          {
            to: task.assignedEmail,
            subject: participantEmailTemplate.subject,
            body: participantEmailTemplate.body,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send emails');
    }

    return true;
  } catch (error) {
    console.error('Failed to send emails:', error);
    return false;
  }
};