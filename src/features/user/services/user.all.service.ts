import { AppError } from '../../../common/errors/app.error.js';
import { UserType } from '../../../common/types/user.types.js';
import Logger from '../../../common/utils/logger.js';
import { User } from '../../../models/user.model.js';

// get all users
export const getAllUsersService = async (): Promise<UserType[]> => {
  try {
    const users = await User.find({})
      .select('-_id -__v -active -mongo_ref -updatedAt -deletedAt -userRole -approved -createdAt')
      .lean<UserType[]>();

    if (!users.length) {
      throw new AppError('No users found', 404);
    }

    return users;
  } catch (error) {
    Logger.error('Error fetching users:', error);
    throw error;
  }
};
