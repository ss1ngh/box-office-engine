import express from 'express';
import * as BookingController from '../../controllers/booking.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate';
import { createBookingSchema } from '../../schema/booking.schema';

const router = express.Router();

// All booking routes require authentication
router.post('/', authenticate, validateBody(createBookingSchema), BookingController.createBooking);
router.patch('/:bookingId/cancel', authenticate, BookingController.cancelBooking);

export default router;
