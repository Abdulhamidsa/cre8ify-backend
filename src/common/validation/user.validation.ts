import { z } from 'zod';

// Sign-up Schema
export const signUpSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters long').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  birthYear: z.number().positive('Birth year must be a positive number').optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  profilePicture: z.string().url('Invalid URL format').optional(),
  country: z.string().optional(),
  profession: z.string().optional(),
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
  username: z.string().min(1, 'Name cannot be empty').optional(),
  birthYear: z.number().positive('Birth year must be a positive number').optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  profilePicture: z.string().url('Invalid URL format').optional(),
  country: z.string().optional(),
  profession: z.string().optional(),
});
export type EditUserInput = z.infer<typeof editUserSchema>;

// user schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  birthYear: z.number(),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
  country: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;

export const userResponeSchema = z.object({
  _id: z.string(),
  mongo_ref: z.string(),
  name: z.string().optional(),

  age: z.number(),
  createdAt: z.string(),
});
export type UserResponse = z.infer<typeof userResponeSchema>;
