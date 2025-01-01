import { AppError } from '../../../common/errors/app.error.js';
import Logger from '../../../common/utils/logger.js';
import { Project } from '../../../models/projects.model.js';
import { User } from '../../../models/user.model.js';

export const getUserProjectsService = async (mongoRef: string) => {
  try {
    // Fetch the user based on mongoRef
    const user = await User.findOne({ mongoRef: mongoRef }).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const projects = await Project.find({ userId: user._id }).lean().select('-__v -userId'); // Exclude fields from the response

    if (!projects || projects.length === 0) {
      throw new AppError('No projects found for this user', 404);
    }

    const transformedProjects = projects.map((project) => ({
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      projectUrl: project.projectUrl,
      projectImage: project.projectImage.map((image) => ({
        url: image.url,
      })),
      tags: project.tags.map((tag) => tag.toString()),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return transformedProjects;
  } catch (error) {
    Logger.error(`Error fetching projects for mongoRef ${mongoRef}:`, error);
    throw error;
  }
};
