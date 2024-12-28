import { AppError } from '../../../common/errors/app.error';
import Logger from '../../../common/utils/logger';
import { ProjectInput } from '../../../common/validation/project.validation';
import { UserProfile } from '../../user/models/user.model';
import { Project } from '../models/projects.model';

export const addProjectService = async (mongoRef: string, projectData: ProjectInput): Promise<ProjectInput> => {
  try {
    // Ensure the user exists
    const user = await UserProfile.findOne({ mongo_ref: mongoRef }).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Create and link the project to the user's mongo_ref
    const newProject = await Project.create({ ...projectData, userId: user._id });
    if (!newProject) {
      throw new AppError('Failed to create project', 500);
    }

    return newProject;
  } catch (error) {
    Logger.error(`Error adding project for user ${mongoRef}:`, error);
    throw error;
  }
};
