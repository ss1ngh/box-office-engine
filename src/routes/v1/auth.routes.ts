import express from 'express';
import { AuthController } from '../../controllers';
import { validateBody } from '../../middlewares/validate';
import { loginSchema, registerSchema } from '../../schema/auth.schema';


const router = express.Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('./login', validateBody(loginSchema), AuthController.login);

export default router;