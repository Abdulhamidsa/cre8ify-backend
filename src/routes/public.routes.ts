import { Router } from 'express';

import { authenticateAndRefresh } from '../common/middleware/authintication.middleware.js';
import { ValidZod } from '../common/middleware/zod.middleware.js';
import { createResponse } from '../common/utils/response.handler.js';
// import { createResponse } from '../common/utils/response.handler.js';
import { fetchedProjectQuerySchema } from '../common/validation/project.zod.js';
// import { projectValidationSchema } from '../common/validation/project.validation.js';
import { signInSchema, signUpSchema } from '../common/validation/user.zod.js';
import { refreshTokenHandler, signInHandler, signupHandler } from '../features/auth/auth.handlers.js';
import { handleGetAllProjects } from '../features/project/project.handler.js';
// import { handleAddProject } from '../features/project/project.handler.js';
import { handleFetchAllUsers } from '../features/user/user.handler.js';

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
router.get('/all', ValidZod(fetchedProjectQuerySchema, 'query'), handleGetAllProjects);
// ==============================
//         PROJECT ROUTES
// ==============================

export default router;
