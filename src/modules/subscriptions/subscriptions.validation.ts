import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(1, 'Price must be greater than 0'),
    currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']).default('NGN'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    category: z.enum(['Entertainment', 'Utilities', 'Software', 'Other']).default('Other'),
    startDate: z.iso.datetime().optional(), // ISO String
    image: z.url().optional(), // For logos
  }),
});

export const updateSubscriptionSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']).optional(),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    category: z.string().optional(),
    startDate: z.iso.datetime().optional(), // ISO String
  }),
});

// Type inference
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>['body'];
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>['body'];