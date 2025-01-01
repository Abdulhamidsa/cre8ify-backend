import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import { SECRETS } from '../config/config.js';
import { AppError } from '../errors/app.error.js';
import { SignInResponse } from '../types/user.types.js';
import { getErrorMessage } from '../utils/error.utils.js';

interface UserPayload {
  mongo_ref: string;
  friendlyId: string;
}

const createToken = (payload: object, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateAccessToken = (payload: UserPayload): string => {
  if (!payload.mongo_ref || !payload.friendlyId) {
    throw new AppError('User ID (mongo_ref) and friendlyId are required to generate access token', 400);
  }
  return createToken(payload, SECRETS.jwtSecret || '', SECRETS.accessTokenExpiration || '10m');
};

export const generateRefreshToken = (payload: UserPayload): string => {
  if (!payload.mongo_ref || !payload.friendlyId) {
    throw new AppError('User ID (mongo_ref) and friendlyId are required to generate refresh token', 400);
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

export const generateTokens = async (mongo_ref: string, friendlyId: string): Promise<SignInResponse> => {
  if (!mongo_ref || !friendlyId) {
    throw new AppError('Invalid user reference or friendlyId for token generation', 500);
  }

  const accessToken = generateAccessToken({ mongo_ref, friendlyId });
  const refreshToken = generateRefreshToken({ mongo_ref, friendlyId });

  return { accessToken, refreshToken, mongo_ref, friendlyId };
};
