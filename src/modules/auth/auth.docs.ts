import { registry } from '../../config/swagger.registry.js';
import { registerSchema, loginSchema } from './auth.validation.js';

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  summary: 'Register a new user',
  request: {
    body: {
      content: {
        'application/json': { schema: registerSchema.shape.body },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
    },
    400: { description: 'Validation Error' },
    409: { description: 'Email already exists' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  summary: 'Login user',
  request: {
    body: {
      content: {
        'application/json': { schema: loginSchema.shape.body },
      },
    },
  },
  responses: {
    200: { description: 'Login successful, cookies set' },
    401: { description: 'Invalid credentials' },
  },
});