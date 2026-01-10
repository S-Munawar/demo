// user.ts/routes// auth.ts/routes

import { Router } from 'express';
import { isRequired } from '../middleware/auth';
import { profile } from '../controllers/user';

const router: Router = Router();

router.get('/profile', isRequired, profile);

export default router;