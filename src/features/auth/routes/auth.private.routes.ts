import { Router } from 'express';

import { attachUserContext } from '../../../common/middleware/attach.user.context';
import { authenticateAndRefresh } from '../../../common/middleware/authintication.middleware';
import { ValidZod } from '../../../common/middleware/zod.middleware';
import { createResponse } from '../../../common/utils/response.handler';
import { updateCredentialsSchema } from '../../../common/validation/user.zod';
import { fetchCredentialsHandler, signoutHandler, updateCredentialsHandler } from '../auth.handlers';

const router = Router();

router.use(authenticateAndRefresh, attachUserContext);

router.get('/refresh', (_req, res) => {
  res.status(200).json(
    createResponse(true, {
      message: 'Token refreshed successfully',
    }),
  );
});

router.get('/credentials', fetchCredentialsHandler);
router.put('/credentials', ValidZod(updateCredentialsSchema), updateCredentialsHandler);
router.post('/signout', signoutHandler);

export default router;
