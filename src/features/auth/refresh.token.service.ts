import { AppError } from '../../common/errors/app.error';
import { generateAccessToken, verifyToken } from '../../common/utils/jwt';
import Logger from '../../common/utils/logger';

export const refreshTokenService = async (refreshToken: string): Promise<{ accessToken: string }> => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 401);
  }

  try {
    const decoded = await verifyToken(refreshToken, 'refresh');
    const mongoRef = decoded?.mongo_ref;

    if (!mongoRef) {
      throw new AppError('Invalid refresh token payload', 403);
    }

    const newAccessToken = generateAccessToken({ mongo_ref: mongoRef });
    return { accessToken: newAccessToken };
  } catch (error) {
    Logger.info('Error refreshing token:', error);
    throw new AppError('An unexpected error occurred while refreshing token', 500);
  }
};
