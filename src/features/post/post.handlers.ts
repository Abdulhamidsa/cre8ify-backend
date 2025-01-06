import { RequestHandler } from 'express';

import { createResponse } from '../../common/utils/response.handler';
import { FetchAllPostsQuery } from '../../common/validation/project.zod';
import { addPostService } from './services/post.add.service';
import { fetchAllPostsService } from './services/post.get.all.service';

export const handleAddPost: RequestHandler = async (req, res, next) => {
  const mongoRef = res.locals.mongoRef;
  const validatedData = req.body;
  console.log(validatedData);

  try {
    const post = await addPostService(mongoRef, validatedData);
    res.status(201).json(createResponse(true, post));
  } catch (error) {
    next(error);
  }
};

export const handleFetchAllPosts: RequestHandler = async (req, res, next) => {
  try {
    const { limit, page } = req.query as FetchAllPostsQuery;
    const posts = await fetchAllPostsService({ limit, page });
    res.status(200).json(createResponse(true, posts));
  } catch (error) {
    next(error);
  }
};
