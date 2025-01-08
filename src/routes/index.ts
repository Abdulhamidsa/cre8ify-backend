import { Router } from 'express';

import { attachUserContext } from '../common/middleware/attach.user.context.js';
import { authenticateAndRefresh } from '../common/middleware/authintication.middleware.js';
import authPrivateRoutes from '../features/auth/routes/auth.private.routes.js';
import authPublicRoutes from '../features/auth/routes/auth.public.routes.js';
import postPrivateRoutes from '../features/post/routes/post.private.routes.js';
import projectPrivateRoutes from '../features/project/routes/projects.private.routes.js';
import projectsPublicRoutes from '../features/project/routes/projects.public.routes.js';
import userPrivateRoutes from '../features/user/routes/user.private.routes.js';

const router = Router();

// Public routes
router.use('/auth', authPublicRoutes);
router.use(projectsPublicRoutes);

// Private routes (common middlewares)
router.use(authenticateAndRefresh, attachUserContext);

router.use(authPrivateRoutes);
router.use(projectPrivateRoutes);
router.use(userPrivateRoutes);
router.use(postPrivateRoutes);

export default router;
