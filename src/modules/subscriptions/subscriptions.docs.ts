import { registry } from '../../config/swagger.registry.js';
import { z } from 'zod';
import { createSubscriptionSchema } from './subscriptions.validation.js';

// Define Schemas for Responses
const SubscriptionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  frequency: z.string(),
  category: z.string(),
  startDate: z.string(),
  nextPaymentDate: z.string(),
  status: z.enum(['active', 'cancelled', 'expired']),
});

// --- 1. GET ALL ---
registry.registerPath({
  method: 'get',
  path: '/subscriptions',
  summary: 'Get all user subscriptions',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of subscriptions',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            results: z.number(),
            data: z.object({ subscriptions: z.array(SubscriptionSchema) }),
          }),
        },
      },
    },
  },
});

// --- 2. CREATE ---
registry.registerPath({
  method: 'post',
  path: '/subscriptions',
  summary: 'Create a new subscription',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createSubscriptionSchema.shape.body },
      },
    },
  },
  responses: {
    201: {
      description: 'Subscription created',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.object({ subscription: SubscriptionSchema }),
          }),
        },
      },
    },
  },
});

// --- 3. GET UPCOMING (Bonus) ---
registry.registerPath({
  method: 'get',
  path: '/subscriptions/upcoming',
  summary: 'Get subscriptions due in the next 7 days',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of upcoming renewals',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            results: z.number(),
            data: z.object({ upcoming: z.array(SubscriptionSchema) }),
          }),
        },
      },
    },
  },
});

// --- 4. CANCEL ---
registry.registerPath({
  method: 'patch',
  path: '/subscriptions/{id}/cancel',
  summary: 'Cancel a subscription',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Subscription cancelled successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z.object({ subscription: SubscriptionSchema }),
          }),
        },
      },
    },
  },
});

// --- 5. GET ONE ---
registry.registerPath({
  method: 'get',
  path: '/subscriptions/{id}',
  summary: 'Get subscription details',
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'Subscription details' },
    404: { description: 'Subscription not found' },
  },
});

// --- 6. DELETE ---
registry.registerPath({
  method: 'delete',
  path: '/subscriptions/{id}',
  summary: 'Delete a subscription',
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'Subscription deleted' },
  },
});