import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import { SECRETS } from '../config/config';
import { AppError } from '../errors/app.error';
import { SignInResponse } from '../types/user.types';
import { getErrorMessage } from '../utils/error.utils';

interface UserPayload {
  mongo_ref?: string;
}

const createToken = (payload: object, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateAccessToken = (payload: UserPayload): string => {
  if (!payload.mongo_ref) {
    throw new AppError('User ID (mongo_ref) is required to generate access token', 400);
  }
  return createToken(payload, SECRETS.jwtSecret || '', SECRETS.accessTokenExpiration || '10m');
};

export const generateRefreshToken = (payload: UserPayload): string => {
  if (!payload.mongo_ref) {
    throw new AppError('User ID (mongo_ref) is required to generate refresh token', 400);
  }
  return createToken(payload, SECRETS.jwtRefreshSecret || '', SECRETS.refreshTokenExpiration || '1d');
};

// Utility to get the appropriate secret
const getTokenSecret = (tokenType: 'access' | 'refresh'): string => {
  if (tokenType === 'access') {
    return SECRETS.jwtSecret || '';
  }
  return SECRETS.jwtRefreshSecret || '';
};

// Function to handle token verification
const validateToken = (token: string, secret: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error: unknown) {
    throw handleTokenError(error);
  }
};

// Function to handle token-specific errors
const handleTokenError = (error: unknown): AppError => {
  const message = getErrorMessage(error);
  const errorName = (error as JsonWebTokenError)?.name;

  const errorMessages: Record<string, string> = {
    JsonWebTokenError: 'Token is invalid',
    TokenExpiredError: 'Token has expired',
  };

  const responseMessage = errorMessages[errorName] || 'Token verification failed';
  const statusCode = errorName === 'TokenExpiredError' ? 401 : 403;

  return new AppError(responseMessage || message, statusCode);
};

// Main function to verify tokens
export const verifyToken = async (token: string, tokenType: 'access' | 'refresh'): Promise<JwtPayload> => {
  if (!token) {
    throw new AppError('Token is required', 401);
  }

  const secret = getTokenSecret(tokenType);
  return validateToken(token, secret);
};

export const generateTokens = async (mongo_ref: string): Promise<SignInResponse> => {
  if (!mongo_ref) {
    throw new AppError('Invalid user reference for token generation', 500);
  }

  const accessToken = generateAccessToken({ mongo_ref });
  const refreshToken = generateRefreshToken({ mongo_ref });

  return { accessToken, refreshToken, mongo_ref };
};
