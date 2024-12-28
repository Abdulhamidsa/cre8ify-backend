import { AppError } from '../../../common/errors/app.error';
// import { User } from '../../../common/types/user.types';
import Logger from '../../../common/utils/logger';
import { UserProfile } from '../models/user.model';

export const getUserProfileService = async (mongoRef: string) => {
  try {
    // Fetch the user profile based on mongoRef
    const user = await UserProfile.findOne({ mongo_ref: mongoRef })
      .select(' -__v -active -updatedAt -deletedAt')
      .lean(); // lean() for better performance

    if (!user) {
      throw new AppError('User profile not found', 404);
    }

    return user;
  } catch (error) {
    Logger.error('Error fetching user profile', error);
    throw new AppError(
      error instanceof AppError ? error.message : 'An unexpected error occurred while fetching the user profile',
      error instanceof AppError ? error.status : 500,
    );
  }
};
