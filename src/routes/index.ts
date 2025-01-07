import { Router } from 'express';

import authPrivateRoutes from '../features/auth/routes/auth.private.routes.js';
import authPublicRoutes from '../features/auth/routes/auth.public.routes.js';
import postPrivateRoutes from '../features/post/routes/post.private.routes.js';
import projectPrivateRoutes from '../features/project/routes/projects.private.routes.js';
import userPrivateRoutes from '../features/user/routes/user.private.routes.js';

const router = Router();

// Public routes
router.use('/auth', authPublicRoutes);

// Private routes (apply common middlewares if needed)
router.use(authPrivateRoutes);
router.use(projectPrivateRoutes);
router.use(userPrivateRoutes);
router.use(postPrivateRoutes);

export default router;
