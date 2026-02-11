import express from 'express';
import * as SeatController from '../../controllers/seat.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate';
import { createSeatsSchema } from '../../schema/seat.schema';

const router = express.Router();

// Public routes
router.get('/screen/:screenId', SeatController.getSeatsByScreen);
router.get('/showtime/:showtimeId/available', SeatController.getAvailableSeats);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), validateBody(createSeatsSchema), SeatController.createSeats);

export default router;
