import jwt from 'jsonwebtoken';

import { SECRETS } from '../config/config';
import { AppError } from '../errors/app.error';

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
  return createToken(payload, SECRETS.jwtSecret, SECRETS.accessTokenExpiration || '10m');
};

export const generateRefreshToken = (payload: UserPayload): string => {
  if (!payload.mongo_ref) {
    throw new AppError('User ID (mongo_ref) is required to generate refresh token', 400);
  }
  return createToken(payload, SECRETS.jwtRefreshSecret, SECRETS.refreshTokenExpiration || '1d');
};

export const verifyToken = async (token: string, tokenType: 'access' | 'refresh'): Promise<jwt.JwtPayload> => {
  if (!token) {
    throw new AppError('Token is required', 401);
  }

  const secret = tokenType === 'access' ? SECRETS.jwtSecret : SECRETS.jwtRefreshSecret;

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    const errorMessages: Record<string, string> = {
      JsonWebTokenError: `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} token is invalid`,
      TokenExpiredError: `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} token has expired`,
    };

    const message = errorMessages[error.name] || 'Token verification failed';
    const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;

    throw new AppError(message, statusCode);
  }
};
