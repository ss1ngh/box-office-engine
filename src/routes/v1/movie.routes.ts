import express from 'express';
import { MovieController } from '../../controllers';
const router = express.Router();

router.post('/', MovieController.addMovie);
router.delete('/', MovieController.deleteMovie);
router.get('/:id', MovieController.getMovie);
router.get('/', MovieController.getAllMovies);

export default router;