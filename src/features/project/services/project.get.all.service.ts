import { AppError } from '../../../common/errors/app.error';
import { Project } from '../../../models/projects.model';

export const getAllProjectsService = async ({ limit, page }: { limit?: number; page?: number }) => {
  try {
    const query = {};
    const options = {
      limit: limit || 10, // Default to 10 if not specified
      skip: page ? (page - 1) * (limit || 10) : 0, // Pagination logic
    };

    const projects = await Project.find(query, null, options)
      .select('-__v') // Exclude the __v field
      .populate({ path: 'tags', select: 'name' }) // Populate the tags field with only the name field
      .lean(); // Use `.lean()` for plain JS objects

    if (!projects || projects.length === 0) {
      throw new AppError('No projects found', 404);
    }

    // Process the projects to transform tags and media
    const processedProjects = projects.map((project) => ({
      ...project,
      media: project.media.map((m) => ({ ...m })), // Flatten media objects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: project.tags.map((tag: any) => ({
        id: tag._id, // Rename `_id` to `id`
        name: tag.name,
      })), // Transform tags to include `id` instead of `_id`
    }));

    return processedProjects;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch projects', 500);
  }
};
