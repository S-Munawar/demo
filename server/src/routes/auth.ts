// auth.ts/routes

import { Router } from 'express';
import { Register, Login } from '../controllers/auth';
import { isRequired } from '../middleware/auth';

const router: Router = Router();

router.post('/register', isRequired, Register);
router.post('/login', isRequired, Login);

export default router;