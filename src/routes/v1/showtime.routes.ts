import express from 'express';
import * as ShowtimeController from '../../controllers/showtime.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate';
import { createShowtimeSchema, updateShowtimeSchema } from '../../schema/showtime.schema';

const router = express.Router();

// Public routes - supports query params: ?movieId=1&screenId=1&date=2026-02-07
router.get('/', ShowtimeController.getAllShowtimes);
router.get('/:showtimeId', ShowtimeController.getShowtimeById);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), validateBody(createShowtimeSchema), ShowtimeController.createShowtime);
router.put('/:showtimeId', authenticate, authorize('ADMIN'), validateBody(updateShowtimeSchema), ShowtimeController.updateShowtime);
router.delete('/:showtimeId', authenticate, authorize('ADMIN'), ShowtimeController.deleteShowtime);

export default router;
