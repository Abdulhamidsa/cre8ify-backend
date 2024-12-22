import { z } from "zod";

// Sign-up Schema
export const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().nonempty("Name cannot be empty"),
  age: z.number().positive("Age must be a positive number"),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().nonempty("Password cannot be empty"),
});
