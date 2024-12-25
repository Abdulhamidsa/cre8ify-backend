import { RequestHandler } from 'express';

import { getCookieOptions } from '../../common/utils/cookie.utils';
import { createResponse } from '../../common/utils/response.handler';
import { SignInInput, SignUpInput } from '../../common/validation/user.validation';
import { signInUser } from './auth.signin.service';
import { signUpUserService } from './auth.signup.service';
import { refreshTokenService } from './refresh.token.service';

// signup handler
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
    const cookieOptions = getCookieOptions();
    res.cookie('refreshToken', result.data?.refreshToken, cookieOptions);
    res.status(200).json(createResponse(true, { accessToken: result.data?.accessToken }));
    return;
  } catch (error) {
    next(error);
  }
};

// Refresh token handler
export const refreshTokenHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
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
