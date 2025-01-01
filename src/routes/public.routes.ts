import { Router } from 'express';

import { authenticateAndRefresh } from '../common/middleware/authintication.middleware';
import { ValidZod } from '../common/middleware/zod.middleware';
import { createResponse } from '../common/utils/response.handler';
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

router.get('/auth/refresh', authenticateAndRefresh, (_req, res) => {
  // If middleware succeeds, it attaches `user` to req.locals
  res.status(200).json(
    createResponse(true, {
      message: 'Token refreshed successfully',
    }),
  );
});

// ==============================
//         USER ROUTES
// ==============================

router.get('/users-all', handleFetchAllUsers);

// ==============================
//         PROJECT ROUTES
// ==============================

export default router;
