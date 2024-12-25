import { RequestHandler } from 'express';

import { createResponse } from '../../../common/utils/response.handler';
import { getAllUsersService } from '../services/user.service';

export const handleFetchAllUsers: RequestHandler = async (_req, res, next): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(createResponse(true, users));
  } catch (error) {
    next(error);
  }
};

// fetch user profile
// export const handleFetchUserProfile: RequestHandler = async (req, res, next) => {
//   const userId = req.params.userid;
//   try {
//     const user = await getUserProfileService(userId);
//     res.json(getSuccessResponse(user));
//   } catch (error) {
//     next(error);
//   }
// };
// edit user profile
// export const handleEditUserProfile: RequestHandler = async (req, res, next) => {
//   const userId = req.params.userId;
//   // const userId = req.locals.userId;
//   const data = req.body;
//   console.log(data);
//   try {
//     const user = await editUserProfileService(userId, data);
//     res.status(200).json(getSuccessResponse(user));
//     return;
//   } catch (error) {
//     next(error);
//   }
// };
