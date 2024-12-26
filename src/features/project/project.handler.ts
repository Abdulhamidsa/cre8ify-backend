import { RequestHandler } from 'express';

import { createResponse } from '../../common/utils/response.handler';
import { fetchAllProjects } from './services/project.all.service';

export const handleFetchAllProjects: RequestHandler = async (req, res, next) => {
  //   const userId = req.locals.userId;
  const userId = req.params.userId;
  try {
    const projects = await fetchAllProjects(userId);
    res.status(200).json(createResponse(true, projects));
    return;
  } catch (error) {
    next(error);
  }
};
