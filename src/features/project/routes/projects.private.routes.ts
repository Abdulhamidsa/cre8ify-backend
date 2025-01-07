import { Router } from 'express';

import { ValidZod } from '../../../common/middleware/zod.middleware';
import {
  addProjectSchema,
  editProjectValidationSchema,
  projectIdValidationSchema,
} from '../../../common/validation/project.zod';
import { handleAddProject, handleDeleteProject, handleEditProject, handleGetUserProjects } from '../project.handler';

const router = Router();

router.post('/project', ValidZod(addProjectSchema, 'body'), handleAddProject);
router.get('/projects', handleGetUserProjects);
router.put(
  '/project/:id',
  ValidZod(projectIdValidationSchema, 'params'),
  ValidZod(editProjectValidationSchema, 'body'),
  handleEditProject,
);
router.delete('/project/:id', ValidZod(projectIdValidationSchema, 'params'), handleDeleteProject);

export default router;
