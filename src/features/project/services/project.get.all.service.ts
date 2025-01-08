import { AppError } from '../../../common/errors/app.error.js';
import Logger from '../../../common/utils/logger.js';
import { fetchProjectWithUser } from '../../../common/validation/project.zod.js';
import { Project } from '../../../models/projects.model.js';
import { Tag } from '../../../models/tag.model.js';
import { User } from '../../../models/user.model.js';

export const getAllProjectsService = async (page: number, limit: number) => {
  try {
    // 1. Fetch projects with pagination
    const skip = (page - 1) * limit;
    const projects = await Project.find({}).skip(skip).limit(limit).lean().select('-__v'); // Exclude unnecessary fields

    if (!projects || projects.length === 0) {
      throw new AppError('No projects found', 404);
    }

    // 2. Transform projects and fetch detailed tags and user data
    const transformedProjects = await Promise.all(
      projects.map(async (project) => {
        // Fetch tags from the Tag collection
        const tags = await Tag.find({ _id: { $in: project.tags } }).select('name');

        // Fetch the user associated with the project
        const user = project.userId
          ? await User.findById(project.userId).select('username profilePicture').lean()
          : null;

        if (!user && project.userId) {
          console.warn(`User not found for userId: ${project.userId}`);
        }
        console.log('Fetched User:', user);

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
          tags: tags.map((tag) => ({ id: tag.id.toString(), name: tag.name })),
          user: user
            ? {
                username: user.username,
                profilePicture: user.profilePicture || null, // Include profilePicture if available
              }
            : null, // Handle missing user gracefully
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
        console.log('Transformed Project:', transformedProject);

        // Validate the transformed project using Zod
        return fetchProjectWithUser.parse(transformedProject);
      }),
    );
    console.log(transformedProjects);
    // 3. Return the validated projects with pagination
    return {
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        total: await Project.countDocuments(),
      },
    };
  } catch (error) {
    Logger.error(`Error fetching projects for page ${page} and limit ${limit}:`, error);
    throw error;
  }
};
