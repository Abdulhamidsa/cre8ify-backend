import { z } from 'zod';

export const addPostSchema = z
  .object({
    content: z.string().optional(), // Optional text content
    image: z.string().url('Invalid URL for image.').optional(), // Optional single image
  })
  .refine((data) => data.content || data.image, {
    message: 'At least one of "content" or "image" is required.',
  });

export type AddPostInput = z.infer<typeof addPostSchema>;
