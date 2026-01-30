import { Resend } from 'resend';
import type { EmailData } from '../modules/notifications/notifications.interface.js';
import { emailTemplates} from '../templates/email.templates.js';
import { env } from '../config/env.config.js';

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await resend.emails.send({
      from: 'SubDub <subscriptions@thynkcity.com>',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email failed:', error);
    return false;
  }
};

/**
 * Send Reminder using the Template System
 */
export const sendReminderEmail = async ({
  email,
  daysLeft,
  ...templateData 
}: EmailData & { email: string }) => {
  
  // 1. Find the correct template based on daysLeft
  // Use .find() to match the 'daysLeft' property we added to the array
  const template = emailTemplates.find(t => t.daysLeft === daysLeft);

  if (!template) {
    console.error(`No email template found for ${daysLeft} days left.`);
    return false;
  }

  // 2. Generate Content
  const subject = template.generateSubject({ ...templateData, daysLeft, email: '', accountSettingsLink: '', supportLink: '' } as EmailData);
  const html = template.generateBody({ ...templateData, daysLeft, email: '', accountSettingsLink: '', supportLink: '' } as EmailData);

  // 3. Send
  return sendEmail(email, subject, html);
};