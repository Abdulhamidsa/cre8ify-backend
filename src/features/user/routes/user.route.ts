import { Router } from "express";
import { handleFetchAllUsers, handleEditUserProfile } from "../handlers/user.handler";
import { signUpUser } from "../../auth/auth.service";

const router = Router();

// fetch all users
router.get("/", handleFetchAllUsers);

// fetch user profile
// router.get("/:userid", handleFetchUserProfile);

// edit user profile
router.put("/:userId", handleEditUserProfile);
router.post("/signup", async (req, res) => {
  const { email, password, name, age } = req.body;

  try {
    const result = await signUpUser(email, password, name, age);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Sign-up failed" });
  }
});

export default router;
