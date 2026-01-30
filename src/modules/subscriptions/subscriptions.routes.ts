import { Router } from 'express';
import * as subController from './subscriptions.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createSubscriptionSchema, updateSubscriptionSchema } from './subscriptions.validation.js';

const router = Router();

router.use(protect); // All routes require login

// 1. General Routes
router.route('/')
  .get(subController.getAll)
  .post(validate(createSubscriptionSchema), subController.create);

// 2. Special Routes (Must be before /:id)
router.get('/upcoming', subController.getUpcoming);

// 3. ID Routes
router.route('/:id')
  .get(subController.getOne)
  .patch(validate(updateSubscriptionSchema), subController.update)
  .delete(subController.remove);

router.patch('/:id/cancel', subController.cancel);

export default router;