import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = Router();

// Auth Routes

// REGISTER /api/v1/auth/register
router.post('/register', validate(registerSchema), authController.register);

// LOGIN /api/v1/auth/login
router.post('/login', validate(loginSchema), authController.login);

// LOGOUT /api/v1/auth/logout
router.post('/logout', authController.logout);

// REFRESH TOKEN /api/v1/auth/refresh
router.post('/refresh', authController.refresh);

export default router;