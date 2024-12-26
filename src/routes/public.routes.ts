import { Router } from 'express';

import { ValidZod } from '../common/middleware/zod.middleware';
import { signInSchema, signUpSchema } from '../common/validation/user.validation';
import { refreshTokenHandler, signInHandler, signupHandler } from '../features/auth/auth.handlers';
import { handleFetchAllUsers } from '../features/user/handlers/user.handler';

const router = Router();

// ==============================
//         AUTH ROUTES
// ==============================

router.post('/signup', ValidZod(signUpSchema, 'body'), signupHandler);
router.get('/signin', ValidZod(signInSchema, 'body'), signInHandler);
router.post('/refresh-token', refreshTokenHandler);

// ==============================
//         USER ROUTES
// ==============================

router.get('/users-all', handleFetchAllUsers);

export default router;
