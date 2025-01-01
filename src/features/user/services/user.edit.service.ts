import { AppError } from '../../../common/errors/app.error';
import Logger from '../../../common/utils/logger';
import { EditUserInput } from '../../../common/validation/user.validation';
import { User } from '../../../models/user.model';

export const editUserProfileService = async (mongoRef: string, profileData: EditUserInput): Promise<EditUserInput> => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { mongoRef: mongoRef },
      { $set: profileData },
      { new: true, lean: true, runValidators: true },
    ).select('-password -active -updatedAt -deletedAt -mongoRef -_id');

    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    return updatedUser;
  } catch (error) {
    Logger.error(`Error updating user profile for ${mongoRef}:`, error);
    throw error;
  }
};
