import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/app.error';

export const attachUserContext = (req: Request, res: Response, next: NextFunction): void => {
  const mongoRef = req.locals?.user?.mongo_ref;
  if (!mongoRef) {
    return next(new AppError('User is not authenticated', 401));
  }
  res.locals.mongoRef = mongoRef;
  next();
};
