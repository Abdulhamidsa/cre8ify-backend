import { RequestHandler } from 'express';

import { AppError } from '../../common/errors/app.error';
import { getCookieOptions } from '../../common/utils/cookie.utils';
// signout handler

import { verifyToken } from '../../common/utils/jwt';
import { createResponse } from '../../common/utils/response.handler';
import { SignInInput, SignUpInput } from '../../common/validation/user.validation';
import { signInUser } from './auth.signin.service';
import { signUpUserService } from './auth.signup.service';
import { refreshTokenService } from './refresh.token.service';

// signup handlerclear

export const signupHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const input: SignUpInput = req.body;
    await signUpUserService(input);
    res.status(201).json(createResponse(true, { message: 'User created successfully' }));
  } catch (error) {
    next(error);
  }
};
// signin handler

export const signInHandler: RequestHandler = async (req, res, next): Promise<void> => {
  const data: SignInInput = req.body;

  try {
    const result = await signInUser(data);

    if (result.data) {
      const { accessToken, refreshToken, mongo_ref } = result.data;

      const accessTokenOptions = getCookieOptions('access');
      const refreshTokenOptions = getCookieOptions('refresh');
      res.cookie('refreshToken', refreshToken, refreshTokenOptions);
      res.cookie('accessToken', accessToken, accessTokenOptions);
      if (mongo_ref) {
        req.locals = { user: { mongo_ref } };
      } else {
        throw new AppError('mongo_ref is missing');
      }

      res.status(200).json(createResponse(true, { message: 'Signin successful' }));
    } else {
      res.status(400).json(createResponse(false, 'Signin failed: Invalid credentials'));
    }
  } catch (error) {
    next(error);
  }
};

// Refresh token handler
export const refreshTokenHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log('refreshToken', refreshToken);
    if (!refreshToken) {
      res.status(401).json(createResponse(false, { message: 'Refresh token is missing' }));
      return;
    }
    const result = await refreshTokenService(refreshToken);
    res.status(200).json(createResponse(true, result));
  } catch (error) {
    next(error);
  }
};

// signout handler
export const signoutHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const userId = res.locals.mongoRef;
    console.log('userId', userId);

    if (!userId) {
      throw new AppError('User is not logged in', 400);
    }

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(400).json(createResponse(false, { message: 'No refresh token found' }));
      return;
    }

    const decoded = await verifyToken(refreshToken, 'refresh');
    if (decoded?.mongo_ref !== userId) {
      throw new AppError('Refresh token does not match the logged-in user', 403);
    }

    // Clear cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    // Respond with success
    res.status(200).json(createResponse(true, { message: 'Signout successful' }));
  } catch (error) {
    next(error);
  }
};
