import { Router } from 'express';

import { ValidZod } from '../common/middleware/zod.middleware';
// import { projectValidationSchema } from '../common/validation/project.validation';
import { signInSchema, signUpSchema } from '../common/validation/user.validation';
import { refreshTokenHandler, signInHandler, signupHandler } from '../features/auth/auth.handlers';
// import { handleAddProject } from '../features/project/project.handler';
import { handleFetchAllUsers } from '../features/user/user.handler';

const router = Router();

// ==============================
//         AUTH ROUTES
// ==============================

router.post('/signup', ValidZod(signUpSchema, 'body'), signupHandler);
router.post('/signin', ValidZod(signInSchema, 'body'), signInHandler);
router.post('/refresh-token', refreshTokenHandler);

// ==============================
//         USER ROUTES
// ==============================

router.get('/users-all', handleFetchAllUsers);

// ==============================
//         PROJECT ROUTES
// ==============================

export default router;
