import { User } from "../models/user.model";
import { AppError } from "../../../common/errors/app.error";
import { IUser } from "../../../common/types/user.types";

// Service to fetch all users
export const getAllUsersService = async (): Promise<IUser[]> => {
  try {
    const users = await User.find({}).select("-_id -__v -active -updatedAt -deletedAt -userRole -approved").lean<IUser[]>(); // Using lean for better performance and type inference
    return users;
  } catch (error: any) {
    throw new AppError(error.message || "Error fetching all users", error.status || 500);
  }
};
