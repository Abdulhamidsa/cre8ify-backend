import { AppError } from '../../../common/errors/app.error';
import Logger from '../../../common/utils/logger';
import { UserResponse } from '../../../common/validation/user.validation';
import { User } from '../models/user.model';

export const getUserProfileService = async (mongoRef: string): Promise<UserResponse> => {
  try {
    // Fetch the user profile based on mongoRef
    const user = await User.findOne({ mongo_ref: mongoRef })
      .select<UserResponse>('-__v -active -deletedAt')
      .lean<UserResponse>();

    if (!user) {
      throw new AppError('User profile not found', 404);
    }

    return user;
  } catch (error) {
    Logger.error(`Error fetching user profile for mongoRef ${mongoRef}:`, error);
    throw new AppError('Failed to fetch user profile', 500);
  }
};
