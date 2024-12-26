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

// Use this schema to process multiple projects
// const projectArraySchema = z.array(projectSchema);

// Type inference

// Define the schema for editing a project
export const editProjectValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  projectUrl: z.string().url('Invalid URL for projectUrl').optional(),
  projectImage: z
    .array(
      z.object({
        url: z.string().url('Invalid URL for image'),
      }),
    )
    .optional(),
  projectThumbnail: z.string().url('Invalid URL for thumbnail').optional(),
  tags: z.array(z.string()).optional(),
});

export type EditProjectInput = z.infer<typeof editProjectValidationSchema>;

export const projectIdValidationSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId'),
});
