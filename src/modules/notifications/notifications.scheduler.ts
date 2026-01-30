import cron from 'node-cron';
import { Subscription } from '../subscriptions/subscriptions.model.js';
import { sendReminderEmail } from '../../services/email.services.js';
import type { IUser } from '../users/users.interface.js';

const REMINDER_DAYS = [7, 5, 2, 1];

export const startReminderJob = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Running Multi-Day Reminder Job...');

    const today = new Date();
    
    // Iterate over each reminder milestone (7, 5, 2, 1)
    for (const daysLeft of REMINDER_DAYS) {
      
      // Calculate target date: Today + daysLeft
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + daysLeft);
      targetDate.setHours(0, 0, 0, 0);

      const targetEndDate = new Date(targetDate);
      targetEndDate.setHours(23, 59, 59, 999);

      // Find subscriptions renewing on this specific target date
      const subs = await Subscription.find({
        status: 'active',
        nextPaymentDate: { $gte: targetDate, $lte: targetEndDate }
      }).populate('user');

      for (const sub of subs) {
        const user = sub.user as unknown as IUser;
        if (user && user.email) {
            await sendReminderEmail({
                email: user.email,
                daysLeft: daysLeft, // Pass the specific milestone
                userName: user.name,
                subscriptionName: sub.name,
                renewalDate: sub.nextPaymentDate.toDateString(),
                planName: `${sub.frequency} Plan`,
                price: `${sub.currency} ${sub.price}`,
                paymentMethod: "Default Card", // Placeholder if you don't store cards yet
                accountSettingsLink: "https://subdub.com/settings",
                supportLink: "https://subdub.com/support"
            });
        }
      }
    }
  });
};