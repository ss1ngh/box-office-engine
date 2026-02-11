import express from 'express';
import movieRoutes from './movie.routes';
import authRoutes from './auth.routes';
import theaterRoutes from './theater.routes';
import screenRoutes from './screen.routes';
import seatRoutes from './seat.routes';
import showtimeRoutes from './showtime.routes';
import bookingRoutes from './booking.routes';
import userRoutes from './user.routes';

const router = express.Router();

router.use('/movies', movieRoutes);
router.use('/auth', authRoutes);
router.use('/theaters', theaterRoutes);
router.use('/screens', screenRoutes);
router.use('/seats', seatRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);

export default router;