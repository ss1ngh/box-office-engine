import express from 'express';
import {TheaterController} from '../../controllers';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate';
import { createTheaterSchema, updateTheaterSchema } from '../../schema/theater.schema';

const router = express.Router();

//public routes
router.get('/', TheaterController.getAllTheaters);
router.get('/:theaterId', TheaterController.getTheaterById);

//admin only routes
router.post('/', authenticate, authorize('ADMIN'), validateBody(createTheaterSchema), TheaterController.createTheater);
router.put('/:theaterId', authenticate, authorize('ADMIN'), validateBody(updateTheaterSchema), TheaterController.updateTheater);
router.delete('/:theaterId', authenticate, authorize('ADMIN'), TheaterController.deleteTheater);

export default router;
