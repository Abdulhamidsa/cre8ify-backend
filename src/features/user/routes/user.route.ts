import { Router } from "express";
import { handleFetchAllUsers, handleEditUserProfile } from "../handlers/user.handler";
import { signupHandler } from "../../auth/auth.handler";
import { ValidZod } from "../../../common/middleware/zod.middleware";
import { signUpSchema } from "../../../common/validation/user.validation";
const router = Router();

// fetch all users
router.get("/", handleFetchAllUsers);

// fetch user profile
// router.get("/:userid", handleFetchUserProfile);

router.put("/:userId", handleEditUserProfile);
router.post("/signup", ValidZod(signUpSchema, "body"), signupHandler);

export default router;
