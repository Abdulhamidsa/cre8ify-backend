import { Router } from 'express';

import privateRoutes from './private.routes';
import publicRoutes from './public.routes';

const router = Router();

// Public routes (accessible without authentication)
router.use('/internal', privateRoutes);

// Private routes (require authentication)
router.use('/public', publicRoutes);

export default router;
