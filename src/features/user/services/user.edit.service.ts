import { AppError } from '../../../common/errors/app.error';
import { generateFriendlyId } from '../../../common/utils/generate.id';
import Logger from '../../../common/utils/logger';
import { saveImageToCloudinary } from '../../../common/utils/saveImageToCloudinary';
import { EditUserInput } from '../../../common/validation/user.validation';
import { User } from '../../../models/user.model';

export const editUserProfileService = async (mongoRef: string, profileData: EditUserInput): Promise<EditUserInput> => {
  try {
    let profilePictureUrl = '';
    let coverImageUrl = '';

    // Handle profile picture upload if provided
    if (profileData.profilePicture) {
      profilePictureUrl = await saveImageToCloudinary(
        profileData.profilePicture,
        'users/profile_pictures',
        [{ quality: 'auto', width: 400, height: 400, crop: 'fill' }],
        'webp',
      );
      profileData = { ...profileData, profilePicture: profilePictureUrl };
    }

    // Handle cover image upload if provided
    if (profileData.coverImage) {
      coverImageUrl = await saveImageToCloudinary(
        profileData.coverImage,
        'users/cover_images',
        [{ quality: 'auto', width: 1200, height: 300, crop: 'fill' }],
        'webp',
      );
      profileData = { ...profileData, coverImage: coverImageUrl };
    }

    // Generate a new friendlyId if the username is updated
    if (profileData.username) {
      profileData = { ...profileData, friendlyId: generateFriendlyId(profileData.username) };
      Logger.info(`Generated new friendlyId: ${profileData.friendlyId}`);
    }

    // Update the user document in the database
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
