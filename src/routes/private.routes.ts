import { Router } from 'express';

import { attachUserContext } from '../common/middleware/attach.user.context';
import { authenticateAndRefresh } from '../common/middleware/authintication.middleware';
import { ValidZod } from '../common/middleware/zod.middleware';
import { editUserSchema, userSchema } from '../common/validation/user.validation';
import { handleDeleteUser, handleFetchUserProfile } from '../features/user/handlers/user.handler';
import { handleEditUserProfile } from '../features/user/handlers/user.handler';

const router = Router();
router.use(authenticateAndRefresh, attachUserContext);

// ==============================
//         USER ROUTES
// ==============================

router.get('/profile/:friendlyId', ValidZod(userSchema), handleFetchUserProfile);
router.put('/profile', ValidZod(editUserSchema, 'body'), handleEditUserProfile);
router.delete('/profile', handleDeleteUser);

export default router;
