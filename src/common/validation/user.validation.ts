import { z } from 'zod';

// Sign-up Schema
export const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

// Zod schema for editing a user profile
export const editUserProfileValidationSchema = z.object({
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  age: z.number().int().positive('Age must be a positive integer').optional(),
  country: z.string().max(100, 'Country name is too long').optional(),
  profession: z.string().max(100, 'Profession name is too long').optional(),
});

// Infer the TypeScript type from the Zod schema
export type EditUserProfileInput = z.infer<typeof editUserProfileValidationSchema>;

// user schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;
