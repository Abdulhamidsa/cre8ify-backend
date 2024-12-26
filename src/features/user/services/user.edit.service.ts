import { AppError } from '../../../common/errors/app.error';
import Logger from '../../../common/utils/logger';
import { EditUserInput } from '../../../common/validation/user.validation';
import Users from '../models/user.model';

export const editUserProfileService = async (mongoRef: string, profileData: EditUserInput): Promise<EditUserInput> => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { mongo_ref: mongoRef },
      { $set: profileData },
      { new: true, lean: true, runValidators: true },
    ).select('-password -__v -active -updatedAt -deletedAt');

    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    return updatedUser;
  } catch (error) {
    Logger.error(`Error updating user profile for ${mongoRef}:`, error);
    throw new AppError('Failed to update user profile', 500);
  }
};
