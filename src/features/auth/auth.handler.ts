import { Request, Response, NextFunction } from "express";
import { signUpUser } from "./auth.service";
import { SignUpInput } from "../../common/types/types";

export const signupHandler = async (req: Request<{}, {}, SignUpInput>, res: Response, next: NextFunction) => {
  try {
    const result = await signUpUser(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    next(err);
  }
};
