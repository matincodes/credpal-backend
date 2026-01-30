import { registry } from '../../config/swagger.registry.js';
import { z } from 'zod';
import { changePasswordSchema } from './users.validation.js';

// Define the User schema for responses
const UserResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

registry.registerPath({
  method: 'get',
  path: '/users/me',
  summary: 'Get current user profile',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Profile retrieved',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.object({ user: UserResponseSchema }),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/users/update-password',
  summary: 'Change current password',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: changePasswordSchema.shape.body },
      },
    },
  },
  responses: {
    200: { description: 'Password updated successfully' },
    401: { description: 'Incorrect current password' },
  },
});