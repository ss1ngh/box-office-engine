import express from 'express';
import { MovieController } from '../../controllers';
import {validateBody } from '../../middlewares/validate';
import { createMovieSchema } from '../../schema/movie.schema';
const router = express.Router();

router.post('/', validateBody(createMovieSchema),MovieController.addMovie);
router.delete('/', MovieController.deleteMovie);
router.get('/:id', MovieController.getMovie);
router.get('/', MovieController.getAllMovies);

export default router;