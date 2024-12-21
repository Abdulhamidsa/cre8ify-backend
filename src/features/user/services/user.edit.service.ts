import { User } from "../models/user.model";
import { IUser } from "../../../common/types/user.types";

interface EditUserProfileData {
  profilePicture?: string;
  bio?: string;
  profession?: string;
  country?: string;
  links?: string[];
}

export const editUserProfileService = async (userId: string, data: EditUserProfileData): Promise<IUser> => {
  try {
    const updateData: Record<string, any> = {}; // Dynamic object for updates

    if (data.profilePicture) {
      updateData["personalInfo.profilePicture"] = data.profilePicture;
    }
    if (data.bio) {
      updateData["personalInfo.bio"] = data.bio;
    }
    if (data.profession) {
      updateData["personalInfo.profession"] = data.profession;
    }
    if (data.country) {
      updateData["personalInfo.country"] = data.country;
    }
    if (data.links && Array.isArray(data.links)) {
      updateData["personalInfo.links"] = data.links;
    }

    const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });

    if (!user) {
      throw { message: "User not found", status: 404 };
    }

    return user;
  } catch (error: any) {
    throw {
      message: error.message || "Error editing user profile",
      status: error.status || 500,
    };
  }
};
