import { Router } from 'express';

import { ValidZod } from '../../../common/middleware/zod.middleware';
import { editUserSchema } from '../../../common/validation/user.zod';
import {
  handleDeleteUser,
  handleEditUserProfile,
  handleFetchUserMinimalInfo,
  handleFetchUserProfile,
} from '../user.handler';

const router = Router();

router.get('/profile/:friendlyId', handleFetchUserProfile);
router.put('/profile', ValidZod(editUserSchema, 'body'), handleEditUserProfile);
router.delete('/profile', handleDeleteUser);
router.get('/logged-user', handleFetchUserMinimalInfo);

export default router;
