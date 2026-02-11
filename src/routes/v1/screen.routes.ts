import express from 'express';
import * as ScreenController from '../../controllers/screen.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate';
import { createScreenSchema, updateScreenSchema } from '../../schema/screen.schema';

const router = express.Router();

// Public routes
router.get('/', ScreenController.getAllScreens);  // Optional query: ?theaterId=1
router.get('/:screenId', ScreenController.getScreenById);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), validateBody(createScreenSchema), ScreenController.createScreen);
router.put('/:screenId', authenticate, authorize('ADMIN'), validateBody(updateScreenSchema), ScreenController.updateScreen);
router.delete('/:screenId', authenticate, authorize('ADMIN'), ScreenController.deleteScreen);

export default router;
