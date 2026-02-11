import express from 'express';
import movieRoutes from './movie.routes';
import authRoutes from './auth.routes';
import theaterRoutes from './theater.routes';
const router = express.Router();

router.use('/movies', movieRoutes);
router.use('/auth', authRoutes)
router.use('/theaters', theaterRoutes)

export default router;