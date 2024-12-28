import { RequestHandler } from 'express';

import { createResponse } from '../../../common/utils/response.handler';
import { getAllUsersService } from '../services/user.all.service';
import { deleteUserService } from '../services/user.delete.service';
import { editUserProfileService } from '../services/user.edit.service';
import { getUserProfileService } from '../services/user.profile.service';

export const handleFetchAllUsers: RequestHandler = async (_req, res, next): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(createResponse(true, users));
    return;
  } catch (error) {
    next(error);
  }
};

// fetch user profile
export const handleFetchUserProfile: RequestHandler = async (_req, res, next) => {
  const mongoRef = res.locals.mongoRef;
  try {
    const user = await getUserProfileService(mongoRef);
    res.status(200).json(createResponse(true, user));
  } catch (error) {
    next(error);
  }
};

// edit user profile

export const handleEditUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const mongoRef = res.locals.mongoRef;
    const profileData = req.body;

    // Call the service to update the profile
    const result = await editUserProfileService(mongoRef, profileData);

    res.status(200).json(createResponse(true, result));
  } catch (error) {
    next(error); // Pass error to middleware
  }
};
// delete user profile

export const handleDeleteUser: RequestHandler = async (_req, res, next): Promise<void> => {
  try {
    const mongoRef = res.locals.mongoRef;
    if (!mongoRef) {
      res.status(401).json(createResponse(false, 'User is not authenticated'));
      return;
    }

    await deleteUserService(mongoRef);
    res.status(200).json(createResponse(true, 'User account deleted successfully'));
  } catch (error) {
    next(error);
  }
};
