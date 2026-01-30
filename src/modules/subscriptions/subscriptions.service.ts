import { Subscription } from './subscriptions.model.js';
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscriptions.validation.js';
import { AppError } from '../../utils/appError.js';

// 1. Create
export const createSubscription = async (userId: string, input: CreateSubscriptionInput) => {
  return await Subscription.create({ 
    ...input, 
    user: userId,
    startDate: input.startDate ? new Date(input.startDate) : new Date() // Default to today if not provided
  });
};

// 2. Get All (With basic filtering)
export const getAllSubscriptions = async (userId: string) => {
  return await Subscription.find({ user: userId }).sort({ createdAt: -1 });
};

// 3. Get Details
export const getSubscriptionById = async (userId: string, subscriptionId: string) => {
  const sub = await Subscription.findOne({ _id: subscriptionId, user: userId });
  if (!sub) throw new AppError('Subscription not found', 404);
  return sub;
};

// 4. Update
export const updateSubscription = async (userId: string, subscriptionId: string, input: UpdateSubscriptionInput) => {
    
    const updatedInput: any = { ...input };

    if (input.startDate) {
        updatedInput.startDate = new Date(input.startDate);
    }
    const sub = await Subscription.findOneAndUpdate(
    { _id: subscriptionId, user: userId },
    updatedInput,
    { new: true, runValidators: true }
  );
  if (!sub) throw new AppError('Subscription not found', 404);
  return sub;
};

// 5. Delete (Hard Delete)
export const deleteSubscription = async (userId: string, subscriptionId: string) => {
  const sub = await Subscription.findOneAndDelete({ _id: subscriptionId, user: userId });
  if (!sub) throw new AppError('Subscription not found', 404);
  return true;
};

// 6. Cancel (Soft Delete / Status Change)
export const cancelSubscription = async (userId: string, subscriptionId: string) => {
  const sub = await Subscription.findOneAndUpdate(
    { _id: subscriptionId, user: userId },
    { status: 'cancelled' },
    { new: true }
  );
  if (!sub) throw new AppError('Subscription not found', 404);
  return sub;
};

// 7. Get Upcoming Renewals 
// Finds bills due in the next 7 days
export const getUpcomingRenewals = async (userId: string) => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return await Subscription.find({
    user: userId,
    status: 'active',
    nextPaymentDate: {
      $gte: today,
      $lte: nextWeek
    }
  }).sort({ nextPaymentDate: 1 }); // Show soonest first
};