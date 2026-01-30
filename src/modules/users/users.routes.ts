import { Router } from 'express';
import * as userController from './users.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateProfileSchema, changePasswordSchema } from './users.validation.js';

const router = Router();

// Apply protection to all routes in this file
router.use(protect);

// GET /api/v1/users/me
router.get('/me', userController.getMe);

// PATCH /api/v1/users/me
router.patch('/me', validate(updateProfileSchema), userController.updateMe);

// PATCH /api/v1/users/update-password
router.patch('/update-password', validate(changePasswordSchema), userController.changePassword);

export default router;