import { AppError } from '../../../common/errors/app.error.js';
import Logger from '../../../common/utils/logger.js';
import { saveImageToCloudinary } from '../../../common/utils/saveImageToCloudinary.js';
import { AddProjectInput } from '../../../common/validation/project.zod.js';
import { Project } from '../../../models/projects.model.js';
import { Tag } from '../../../models/tag.model.js';
import { User } from '../../../models/user.model.js';

export const addProjectService = async (mongoRef: string, projectData: AddProjectInput): Promise<AddProjectInput> => {
  try {
    const user = await User.findOne({ mongoRef }).lean();
    if (!user) throw new AppError('User not found', 404);

    const uploadedMedia = await Promise.all(
      projectData.media.map(async (image) => ({
        url: await saveImageToCloudinary(image.url, 'projects/images', [{ quality: 90, width: 800, crop: 'limit' }]),
      })),
    );

    const thumbnailUrl = projectData.thumbnail
      ? await saveImageToCloudinary(projectData.thumbnail, 'projects/thumbnails', [
          { quality: 'auto', width: 800, crop: 'limit' },
        ])
      : '';

    const tagIds = await Promise.all(
      (projectData.tags || []).map(async (tagName) => {
        const tag = await Tag.findOneAndUpdate({ name: tagName }, {}, { upsert: true, new: true }).lean();
        return tag?._id?.toString();
      }),
    );

    const newProject = await Project.create({
      ...projectData,
      media: uploadedMedia,
      thumbnail: thumbnailUrl,
      tags: tagIds,
      userId: user._id,
    });

    const transformedProject = {
      ...newProject.toObject(),
      tags: newProject.tags.map((tag) => tag.toString()), // Cot tags to stringsnver
    };

    delete transformedProject.id;

    return transformedProject as AddProjectInput;
  } catch (error) {
    Logger.error(
      `Error adding project for user ${mongoRef}: ${error instanceof AppError ? error.message : 'Unexpected error'}`,
    );
    throw error;
  }
};
