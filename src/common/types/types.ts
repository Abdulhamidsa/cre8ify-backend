import { z } from "zod";
import { signUpSchema, loginSchema } from "../../common/validation/user.validation";

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  age: number;
}

export type SignUpResponse = { success: true; data: UserResponse } | { success: false; message: string };

export type LoginResponse = { success: true; token: string } | { success: false; message: string };
