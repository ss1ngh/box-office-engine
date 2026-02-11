import express from 'express';
import * as UserController from '../../controllers/user.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = express.Router();


router.get('/profile', authenticate, UserController.getProfile);
router.get('/bookings', authenticate, UserController.getMyBookings);
router.get('/bookings/:bookingId', authenticate, UserController.getBookingById);

export default router;
