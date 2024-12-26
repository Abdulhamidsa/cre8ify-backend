import { RequestHandler } from 'express';

import { createResponse } from '../../common/utils/response.handler';
import { addProjectService } from './services/project.add.service';
import { getUserProjectsService } from './services/project.get.project.service';

export const handleAddProject: RequestHandler = async (req, res, next): Promise<void> => {
  const mongoRef = res.locals.mongoRef;
  const validatedData = req.body;

  try {
    const project = await addProjectService(mongoRef, validatedData);

    res.status(201).json(createResponse(true, project));
  } catch (error) {
    next(error);
  }
};

// fetch user projects

export const handleGetUserProjects: RequestHandler = async (_req, res, next): Promise<void> => {
  try {
    const userId = res.locals.mongoRef;
    const projects = await getUserProjectsService(userId);
    res.status(200).json(createResponse(true, projects));
  } catch (error) {
    next(error);
  }
};
