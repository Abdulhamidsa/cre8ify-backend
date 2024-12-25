import { AppError } from '../../../common/errors/app.error';
import { User } from '../../../common/types/user.types';
import Logger from '../../../common/utils/logger';
import Users from '../models/user.model';

export const getAllUsersService = async (): Promise<User[]> => {
  try {
    const users = await Users.find({})
      .select('-_id -__v -active -updatedAt -deletedAt -userRole -approved createdAt')
      .lean<User[]>();

    if (!users.length) {
      throw new AppError('No users found', 404);
    }

    return users;
  } catch (error) {
    Logger.error('Error fetching users:', error);
    throw new AppError('An unexpected error occurred while fetching users', 500);
  }
};
