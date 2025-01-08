import { AppError } from '../../../common/errors/app.error.js';
import { User } from '../../../models/user.model.js';

export const getAllUsersService = async (page: number, limit: number) => {
  try {
    // Calculate the pagination offset
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await User.find({}).skip(skip).limit(limit).lean().select('-__v');

    if (!users || users.length === 0) {
      throw new AppError('No users found', 404);
    }

    // Fetch total count for pagination
    const total = await User.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    console.log({ total, limit, totalPages: Math.ceil(total / limit) });

    // Return users with pagination metadata
    return {
      users: users.map((user) => ({
        id: user._id.toString(),
        username: user.username,
        friendlyId: user.friendlyId,
        profilePicture: user.profilePicture || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages, // Ensure totalPages is included here
      },
    };
  } catch (error) {
    throw error;
  }
};
