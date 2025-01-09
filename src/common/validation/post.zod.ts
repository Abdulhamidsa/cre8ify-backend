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
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined)) // Transform to number if defined
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
      message: 'Limit must be a positive integer.',
    }),
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined)) // Transform to number if defined
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
      message: 'Page must be a positive integer.',
    }),
});

export type FetchAllPostsQuery = z.infer<typeof fetchAllPostsSchema>;
