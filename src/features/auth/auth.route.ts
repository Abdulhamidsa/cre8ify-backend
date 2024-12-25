import { Router } from 'express';

import { ValidZod } from '../../common/middleware/zod.middleware';
import { signInSchema, signUpSchema } from '../../common/validation/user.validation';
import { refreshTokenHandler, signInHandler, signupHandler } from './auth.handlers';

const router = Router();

router.post('/signup', ValidZod(signUpSchema, 'body'), signupHandler);
router.get('/signin', ValidZod(signInSchema, 'body'), signInHandler);
router.post('/refresh-token', refreshTokenHandler);

export default router;
