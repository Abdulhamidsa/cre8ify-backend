import { z } from 'zod';

// Sign-up Schema
export const signUpSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().nonempty('Name cannot be empty'),
  age: z.number().positive('Age must be a positive number'),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

// Login Schema
export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
export type SignInInput = z.infer<typeof signInSchema>;

// Refresh Token Schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// edit user schema
export const editUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  age: z.number().positive('Age must be a positive number').optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  profilePicture: z.string().url('Invalid URL format').optional(),
});
export type EditUserInput = z.infer<typeof editUserSchema>;

// user schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;
