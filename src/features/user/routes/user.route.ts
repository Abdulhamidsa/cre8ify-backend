import { Router } from "express";
import { handleFetchAllUsers, handleFetchUserProfile, handleEditUserProfile } from "../handlers/user.handler";

const router = Router();

// fetch all users
router.get("/", handleFetchAllUsers);

// fetch user profile
router.get("/:userid", handleFetchUserProfile);

// edit user profile
router.put("/:userId", handleEditUserProfile);
export default router;
