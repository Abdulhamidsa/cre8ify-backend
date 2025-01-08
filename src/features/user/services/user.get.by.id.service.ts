import { AppError } from '../../../common/errors/app.error';
import Logger from '../../../common/utils/logger';
import { UserResponse } from '../../../common/validation/user.zod';
import { User } from '../../../models/user.model';

export const getPublicUserProfileService = async (friendlyId: string): Promise<Partial<UserResponse>> => {
  try {
    // Fetch user by friendlyId
    const user = await User.findOne({ friendlyId })
      .select('-__v -mongoRef -deletedAt -active') // Exclude private fields
      .lean();

    if (!user) {
      throw new AppError('Public profile not found', 404);
    }

    return {
      username: user.username,
      profilePicture: user.profilePicture || null,
      bio: user.bio || '', // Include only public fields
      createdAt: user.createdAt.toISOString(),
    };
  } catch (error) {
    Logger.error(`Error fetching public user profile for friendlyId ${friendlyId}:`, error);
    throw new AppError('Failed to fetch public profile', 500);
  }
};
