import express from 'express';

import { ValidZod } from '../../../common/middleware/zod.middleware';
import { getAllUsersValidationSchema } from '../../../common/validation/user.zod';
import { handleGetAllUsers } from '../user.handler';

const router = express.Router();

router.get('/users', ValidZod(getAllUsersValidationSchema), handleGetAllUsers);

export default router;
