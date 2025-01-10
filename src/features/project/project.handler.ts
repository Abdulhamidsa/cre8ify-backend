import { RequestHandler } from 'express';

import { createResponse } from '../../common/utils/response.handler.js';
// import { FetchedProjectQueryType } from '../../common/validation/project.zod.js';
import { addProjectService } from './services/project.add.service.js';
import { deleteProjectService } from './services/project.delete.service.js';
import { editProjectService } from './services/project.edit.service.js';
import { getAllProjectsService } from './services/project.get.all.service.js';
import { getUserProjectsService } from './services/project.get.project.service.js';

export const handleAddProject: RequestHandler = async (req, res, next) => {
  const mongoRef = res.locals.mongoRef; // Assuming user identity is in res.locals
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

// fetch all projects

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

// fetch all projects
// export const handleGetAllProjects: RequestHandler = async (req, res, next) => {
//   try {
//     const { limit, page } = req.query as FetchedProjectQueryType; // Validated query parameters
//     const projects = await getAllProjectsService({ limit, page });
//     res.status(200).json(createResponse(true, projects));
//   } catch (error) {
//     next(error); // Pass error to middleware
//   }
// };

export const handleGetAllProjects: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;

    const projects = await getAllProjectsService(page, limit);
    res.status(200).json(createResponse(true, projects));
  } catch (error) {
    next(error);
  }
};
