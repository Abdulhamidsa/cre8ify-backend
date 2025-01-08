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
export const fetchAllPostsSchema = z.object({
  limit: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), { message: 'Limit must be a number.' })
    .transform((val) => (val ? Number(val) : undefined)),
  page: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), { message: 'Page must be a number.' })
    .transform((val) => (val ? Number(val) : undefined)),
});

export type FetchAllPostsQuery = z.infer<typeof fetchAllPostsSchema>;
