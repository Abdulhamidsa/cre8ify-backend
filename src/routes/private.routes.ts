import { Router } from 'express';

import { attachUserContext } from '../common/middleware/attach.user.context.js';
import { authenticateAndRefresh } from '../common/middleware/authintication.middleware.js';
import { ValidZod } from '../common/middleware/zod.middleware.js';
import { addPostSchema } from '../common/validation/post.zod.js';
import {
  addProjectSchema,
  editProjectValidationSchema,
  fetchAllPostsSchema,
  projectIdValidationSchema,
} from '../common/validation/project.zod.js';
import { editUserSchema } from '../common/validation/user.zod.js';
import { signoutHandler } from '../features/auth/auth.handlers.js';
import { handleAddPost, handleFetchAllPosts } from '../features/post/post.handlers.js';
import {
  handleAddProject,
  handleDeleteProject,
  handleEditProject,
  handleGetUserProjects,
} from '../features/project/project.handler.js';
import { handleDeleteUser, handleFetchUserMinimalInfo, handleFetchUserProfile } from '../features/user/user.handler.js';
import { handleEditUserProfile } from '../features/user/user.handler.js';

const router = Router();
router.use(authenticateAndRefresh, attachUserContext);

// ==============================
//         USER ROUTES
// ==============================

router.get('/profile/:friendlyId', handleFetchUserProfile);
router.put('/profile', ValidZod(editUserSchema, 'body'), handleEditUserProfile);
router.delete('/profile', handleDeleteUser);
router.get('/logged-user', handleFetchUserMinimalInfo);
router.post('/signout', signoutHandler);

// ==============================
//         PROJECT ROUTES
// ==============================

// Add project
router.post('/project', ValidZod(addProjectSchema, 'body'), handleAddProject);

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
// add post
router.post('/post', ValidZod(addPostSchema, 'body'), handleAddPost);
// all posts
router.get('/post', ValidZod(fetchAllPostsSchema, 'query'), handleFetchAllPosts);

export default router;
