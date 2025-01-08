import express from 'express';

import { ValidZod } from '../../../common/middleware/zod.middleware.js';
import { getAllUsersValidationSchema } from '../../../common/validation/user.zod.js';
import { handleGetAllUsers } from '../user.handler.js';

const router = express.Router();

router.get('/users', ValidZod(getAllUsersValidationSchema), handleGetAllUsers);

export default router;
