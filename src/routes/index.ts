import { Router } from 'express';

import authPrivateRoutes from '../features/auth/routes/auth.private.routes';
import authPublicRoutes from '../features/auth/routes/auth.public.routes';
import postPrivateRoutes from '../features/post/routes/post.private.routes';
import projectPrivateRoutes from '../features/project/routes/projects.private.routes';
import userPrivateRoutes from '../features/user/routes/user.private.routes';

const router = Router();

// Public routes
router.use('/auth', authPublicRoutes);

// Private routes (apply common middlewares if needed)
router.use(authPrivateRoutes);
router.use(projectPrivateRoutes);
router.use(userPrivateRoutes);
router.use(postPrivateRoutes);

export default router;
