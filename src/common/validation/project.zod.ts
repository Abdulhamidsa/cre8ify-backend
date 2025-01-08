import { z } from 'zod';

export const fetchedProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  url: z.string().url('Invalid URL format.'),
  media: z
    .array(
      z.object({
        url: z.string().url('Invalid URL format.'),
      }),
    )
    .min(1, 'At least one image is required.'),
  thumbnail: z.string().url('Invalid thumbnail URL.'),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
});

export type FetchedProjectType = z.infer<typeof fetchedProjectSchema>;

///

export const fetchProjectWithUser = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  thumbnail: z.string().url(),
  media: z.array(z.object({ url: z.string().url() })),
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
  user: z
    .object({
      username: z.string(),
      profilePicture: z.string().nullable(), // Optional field
    })
    .nullable(),
  createdAt: z.date(), // Accept Date objects
  updatedAt: z.date(), // Accept Date objects
});

export type fetchProjectWithUserType = z.infer<typeof fetchProjectWithUser>;

// Schema for validating optional query parameters (if any)
export const fetchedProjectQuerySchema = z.object({
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

export type FetchedProjectQueryType = z.infer<typeof fetchedProjectQuerySchema>;
export const addProjectSchema = z.object({
  title: z.string().nonempty('Title is required.'),
  description: z.string().nonempty('Description is required.'),
  url: z.string().url('Invalid URL for projectUrl.'),
  media: z
    .array(
      z.object({
        url: z.string().url('Invalid URL for image.'),
      }),
    )
    .min(1, 'At least one project image is required.'),
  thumbnail: z.string().url('Invalid URL for thumbnail').optional(),
  tags: z.array(z.string()).optional(), // Tags as string IDs
});

export type AddProjectInput = z.infer<typeof addProjectSchema>;

export const mongoIdValidationSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId');
export const getProjectValidationSchema = z.object({
  id: mongoIdValidationSchema,
});

// Define the schema for editing a project
export const editProjectValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url('Invalid URL for projectUrl').optional(),
  media: z
    .array(
      z.object({
        url: z.string().url('Invalid URL for image'),
      }),
    )
    .optional(),
  thumbnail: z.string().url('Invalid URL for thumbnail').optional(),
  tags: z.array(z.string()).optional(),
});

export type EditProjectInput = z.infer<typeof editProjectValidationSchema>;

export const projectIdValidationSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId'),
});

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
