// auth.ts/routes

import { Router } from 'express';
import { Register, Login } from '../controllers/auth';

const router: Router = Router();

router.post('/register', Register);
router.post('/login', Login);

export default router;