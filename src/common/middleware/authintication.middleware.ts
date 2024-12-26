import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from '../errors/app.error';
import { getCookieOptions } from '../utils/cookie.utils';
import { getErrorMessage } from '../utils/error.utils';
import { generateAccessToken, verifyToken } from '../utils/jwt';
import Logger from '../utils/logger';
import { createResponse } from '../utils/response.handler';

export const authenticateAndRefresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // Check if accessToken is present and valid
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as { mongo_ref: string };
        req.locals = { user: { mongo_ref: decoded.mongo_ref } };
        return next();
      } catch (error) {
        if ((error as jwt.JsonWebTokenError).name !== 'TokenExpiredError') {
          throw new AppError('Invalid access token', 401);
        }
        // Token expired; proceed to validate refreshToken
      }
    }

    // If accessToken is missing or expired, verify the refreshToken
    if (!refreshToken) {
      throw new AppError('Refresh token is missing', 401);
    }

    const decodedRefresh = (await verifyToken(refreshToken, 'refresh')) as { mongo_ref: string };
    const mongoRef = decodedRefresh.mongo_ref;

    if (!mongoRef) {
      throw new AppError('Invalid refresh token payload', 403);
    }
    const newAccessToken = generateAccessToken({ mongo_ref: mongoRef });
    const accessTokenOptions = getCookieOptions('access');
    res.cookie('accessToken', newAccessToken, accessTokenOptions);

    // Attach user info to req.locals
    req.locals = { user: { mongo_ref: mongoRef } };
    Logger.info(`New access token issued for user: ${mongoRef}`);
    next();
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(`Error in authenticateAndRefresh middleware: ${message}`);
    res.status(error instanceof AppError ? error.status : 401).json(createResponse(false, { message }));
  }
};
