import express from 'express';

import { handleGetAllProjects } from '../project.handler';

const router = express.Router();

router.get('/projects', handleGetAllProjects);

export default router;
