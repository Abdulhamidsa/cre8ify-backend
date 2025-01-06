import { AppError } from '../../../common/errors/app.error.js';
import Logger from '../../../common/utils/logger.js';
import { fetchedProjectSchema } from '../../../common/validation/project.zod.js';
// Import your Zod schema
import { FetchedProjectType } from '../../../common/validation/project.zod.js';
import { Project } from '../../../models/projects.model.js';
import { Tag } from '../../../models/tag.model.js';
import { User } from '../../../models/user.model.js';

export const getUserProjectsService = async (mongoRef: string): Promise<FetchedProjectType[]> => {
  try {
    // 1. Fetch the user based on mongoRef
    const user = await User.findOne({ mongoRef }).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // 2. Fetch projects associated with the user
    const projects = await Project.find({ userId: user._id }).lean().select('-__v -userId'); // Exclude unnecessary fields

    if (!projects || projects.length === 0) {
      throw new AppError('No projects found for this user', 404);
    }

    // 3. Transform projects and fetch detailed tags
    const transformedProjects = await Promise.all(
      projects.map(async (project) => {
        // Fetch tags from the Tag collection
        const tags: { _id: string; name: string }[] = await Tag.find({ _id: { $in: project.tags } }).select('name');

        // Build the transformed project object
        const transformedProject = {
          id: project._id.toString(),
          title: project.title,
          description: project.description,
          url: project.url,
          thumbnail: project.thumbnail,
          media: project.media.map((image) => ({
            url: image.url,
          })),
          tags: tags.map((tag) => ({ id: tag._id.toString(), name: tag.name })), // Include detailed tag info
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };

        // Validate the transformed project using Zod
        return fetchedProjectSchema.parse(transformedProject);
      }),
    );

    // 4. Return the validated projects
    return transformedProjects;
  } catch (error) {
    Logger.error(`Error fetching projects for mongoRef ${mongoRef}:`, error);
    throw error;
  }
};
