import { RequestHandler } from 'express';

import { createResponse } from '../../common/utils/response.handler';
import { addProjectService } from './services/project.add.service';
import { deleteProjectService } from './services/project.delete.service';
import { editProjectService } from './services/project.edit.service';
import { getUserProjectsService } from './services/project.get.project.service';

export const handleAddProject: RequestHandler = async (req, res, next) => {
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

export const handleGetUserProjects: RequestHandler = async (_req, res, next) => {
  try {
    const userId = res.locals.mongoRef;
    const projects = await getUserProjectsService(userId);
    res.status(200).json(createResponse(true, projects));
  } catch (error) {
    next(error);
  }
};

// edit user project
export const handleEditProject: RequestHandler = async (req, res, next) => {
  try {
    const mongoRef = res.locals.mongoRef; // Logged-in user's mongoRef
    const projectId = req.params.id; // Project ID from route
    const projectData = req.body; // Validated project data from request body
    const updatedProject = await editProjectService(mongoRef, projectId, projectData);
    res.status(200).json(createResponse(true, updatedProject));
  } catch (error) {
    next(error);
  }
};

// delete user project
export const handleDeleteProject: RequestHandler = async (req, res, next) => {
  try {
    const mongoRef = res.locals.mongoRef;
    const projectId = req.params.id;
    await deleteProjectService(mongoRef, projectId);
    res.status(200).json(createResponse(true, 'Project deleted successfully'));
  } catch (error) {
    next(error);
  }
};
