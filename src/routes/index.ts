import express from 'express';

import authRoutes from '../features/auth/auth.route';
import userRoutes from '../features/user/user.route';

const router = express.Router();

// user routes
router.use('/users', userRoutes);
// auth routes
router.use('/auth', authRoutes);

export default router;
