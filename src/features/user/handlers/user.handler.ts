import { RequestHandler } from "express";
import { getAllUsersService } from "../services/user.service";
import { getSuccessResponse } from "../../../common/utils/response.handler";
// import { getUserProfileService } from "../services/user.profile.service";
// import { editUserProfileService } from "../services/user.edit.service";

// handler to fetching all users
export const handleFetchAllUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(getSuccessResponse(users));
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
