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

// Define query parameter schema
export const fetchUsersQuerySchema = z.object({
  page: z.number().optional(), // Optional page number for pagination
  limit: z.number().optional(), // Optional limit for pagination
  role: z.string().optional(), // Optional filter for user roles
});

// Infer TypeScript type from the schema
export type FetchUsersQuery = z.infer<typeof fetchUsersQuerySchema>;
