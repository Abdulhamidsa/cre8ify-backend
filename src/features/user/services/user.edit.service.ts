import { AppError } from '../../../common/errors/app.error.js';
import { generateFriendlyId } from '../../../common/utils/generate.id.js';
import Logger from '../../../common/utils/logger.js';
import { saveImageToCloudinary } from '../../../common/utils/saveImageToCloudinary.js';
import { EditUserInput } from '../../../common/validation/user.zod.js';
import { User } from '../../../models/user.model.js';

export const editUserProfileService = async (mongoRef: string, profileData: EditUserInput): Promise<EditUserInput> => {
  try {
    // Fetch the current user data
    const currentUser = await User.findOne({ mongoRef: mongoRef }).lean();

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    let profilePictureUrl = currentUser.profilePicture || '';
    let coverImageUrl = currentUser.coverImage || '';

    // Handle profile picture upload only if it has changed
    if (profileData.profilePicture && profileData.profilePicture !== currentUser.profilePicture) {
      profilePictureUrl = await saveImageToCloudinary(
        profileData.profilePicture,
        'users/profile_pictures',
        [{ quality: 'auto', width: 400, height: 400, crop: 'fill' }],
        'webp',
      );
      profileData = { ...profileData, profilePicture: profilePictureUrl };
    }

    // Handle cover image upload only if it has changed
    if (profileData.coverImage && profileData.coverImage !== currentUser.coverImage) {
      coverImageUrl = await saveImageToCloudinary(
        profileData.coverImage,
        'users/cover_images',
        [{ quality: 'auto', width: 1200, height: 300, crop: 'fill' }],
        'webp',
      );
      profileData = { ...profileData, coverImage: coverImageUrl };
    }

    // Generate a new friendlyId if the username is updated
    if (profileData.username && profileData.username !== currentUser.username) {
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
