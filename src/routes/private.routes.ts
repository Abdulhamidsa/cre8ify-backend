import { Router } from 'express';

import { attachUserContext } from '../common/middleware/attach.user.context';
import { authenticateAndRefresh } from '../common/middleware/authintication.middleware';
import { ValidZod } from '../common/middleware/zod.middleware';
import {
  editProjectValidationSchema,
  projectIdValidationSchema,
  projectValidationSchema,
} from '../common/validation/project.validation';
import { editUserSchema } from '../common/validation/user.validation';
import { signoutHandler } from '../features/auth/auth.handlers';
import {
  handleAddProject,
  handleDeleteProject,
  handleEditProject,
  handleGetUserProjects,
} from '../features/project/project.handler';
import { handleDeleteUser, handleFetchUserProfile } from '../features/user/user.handler';
import { handleEditUserProfile } from '../features/user/user.handler';

const router = Router();
router.use(authenticateAndRefresh, attachUserContext);

// ==============================
//         USER ROUTES
// ==============================

router.get('/profile/:friendlyId', handleFetchUserProfile);
router.put('/profile', ValidZod(editUserSchema, 'body'), handleEditUserProfile);
router.delete('/profile', handleDeleteUser);
router.post('/signout', signoutHandler);

// ==============================
//         PROJECT ROUTES
// ==============================

// Add project
router.post('/project', ValidZod(projectValidationSchema, 'body'), handleAddProject);

// Get project
router.get('/projects', handleGetUserProjects);

// edit project
router.put(
  '/project/:id',
  ValidZod(projectIdValidationSchema, 'params'),
  ValidZod(editProjectValidationSchema, 'body'),
  handleEditProject,
);
// delete project
router.delete('/project/:id', ValidZod(projectIdValidationSchema, 'params'), handleDeleteProject);

export default router;
