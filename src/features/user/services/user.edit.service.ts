import { AppError } from '../../../common/errors/app.error';
import { EditUserProfileInput } from '../../../common/validation/user.validation';
import { UserProfile } from '../models/user.model';

export const editUserProfileService = async (
  mongoRef: string,
  profileData: EditUserProfileInput,
): Promise<{ profileComplete: boolean }> => {
  const requiredFields: (keyof EditUserProfileInput)[] = ['bio', 'age', 'country', 'profession'];

  // Update the profile
  const updatedProfile = await UserProfile.findOneAndUpdate(
    { mongo_ref: mongoRef },
    { $set: profileData },
    { new: true, runValidators: true, lean: true },
  );

  if (!updatedProfile) {
    throw new AppError('User profile not found', 404);
  }

  // Check if all required fields are present
  const isProfileComplete = requiredFields.every((field) => !!updatedProfile[field]);

  // Update the `profileComplete` field if needed
  if (updatedProfile.profileComplete !== isProfileComplete) {
    await UserProfile.updateOne({ mongo_ref: mongoRef }, { profileComplete: isProfileComplete });
  }

  return { profileComplete: isProfileComplete };
};
