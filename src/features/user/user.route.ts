import { Router } from 'express';

import { handleFetchAllUsers } from './handlers/user.handler';

const router = Router();

// fetch all users
router.get('/', handleFetchAllUsers);

// fetch user profile
// router.get("/:userid", handleFetchUserProfile);

// router.put("/:userId", handleEditUserProfile);

export default router;
