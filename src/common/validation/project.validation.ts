import { z } from 'zod';

// Define the Zod schema for project validation
export const projectValidationSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  projectUrl: z.string().url('Invalid URL for projectUrl'),
  projectImage: z
    .array(
      z.object({
        url: z.string().url('Invalid URL for image'),
      }),
    )
    .min(1, 'At least one project image is required'),
  projectThumbnail: z.string().url('Invalid URL for thumbnail').optional(),
  tags: z.array(z.string()).optional(),
});
export type ProjectInput = z.infer<typeof projectValidationSchema>;

export const mongoIdValidationSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId');
export const getProjectValidationSchema = z.object({
  id: mongoIdValidationSchema,
});

// Define the Zod schema for get projects

// Define the schema for a project
const projectSchema = z.object({
  id: z.string().transform((val) => val), // Rename _id to id
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  projectUrl: z.string(),
  projectImage: z.array(
    z.object({
      url: z.string(),
    }),
  ),
  tags: z.array(z.string()), // Array of tag IDs
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Use this schema to process multiple projects
// const projectArraySchema = z.array(projectSchema);

// Type inference
export type Project = z.infer<typeof projectSchema>;
