import { AppError } from '../../../common/errors/app.error';
import Logger from '../../../common/utils/logger';
import { EditProjectInput } from '../../../common/validation/project.validation';
import { Project } from '../../../models/projects.model';
import { User } from '../../../models/user.model';

export const editProjectService = async (mongoRef: string, projectId: string, projectData: EditProjectInput) => {
  try {
    const user = await User.findOne({ mongo_ref: mongoRef }).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const project = await Project.findOne({ _id: projectId, userId: user._id });
    if (!project) {
      throw new AppError('Project not found or not accessible', 404);
    }
    Object.assign(project, projectData);
    await project.save();

    return project.toObject();
  } catch (error) {
    Logger.error(`Error editing project with ID ${projectId}:`, error);
    throw error;
  }
};
