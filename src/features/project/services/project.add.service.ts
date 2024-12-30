import { AppError } from '../../../common/errors/app.error';
import cloudinary from '../../../common/utils/cloudinary.config';
import Logger from '../../../common/utils/logger';
import { ProjectInput } from '../../../common/validation/project.validation';
import { Project } from '../../../models/projects.model';
import { Tag } from '../../../models/tag.model';
import { User } from '../../../models/user.model';

export const addProjectService = async (mongoRef: string, projectData: ProjectInput): Promise<ProjectInput> => {
  try {
    const user = await User.findOne({ mongoRef }).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const uploadedImages = await Promise.all(
      projectData.projectImage.map(async (image) => {
        const uploadResult = await cloudinary.uploader.upload(image.url, {
          folder: 'projects/images',
          format: 'webp', // Ensure WebP format
          transformation: [
            { quality: 90, width: 800, crop: 'limit' }, // Increase quality to 90%
          ],
        });

        return { url: uploadResult.secure_url };
      }),
    );

    let thumbnailUrl = projectData.projectThumbnail;
    if (projectData.projectThumbnail) {
      const thumbnailUploadResult = await cloudinary.uploader.upload(projectData.projectThumbnail, {
        folder: 'projects/thumbnails',
        format: 'webp', // Force WebP storage
        transformation: [{ quality: 'auto', width: 800, crop: 'limit' }],
      });
      thumbnailUrl = thumbnailUploadResult.secure_url;
    }

    const tagIds = [];
    if (projectData.tags) {
      for (const tagName of projectData.tags) {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        tagIds.push(tag._id);
      }
    }

    const newProject = await Project.create({
      ...projectData,
      projectImage: uploadedImages,
      projectThumbnail: thumbnailUrl,
      tags: tagIds,
      userId: user._id,
    });

    const transformedProject: ProjectInput = {
      ...newProject.toObject(),
      tags: newProject.tags.map((tag) => tag.toString()),
    };

    return transformedProject;
  } catch (error) {
    Logger.error(`Error adding project for user ${mongoRef}:`, error);
    throw error;
  }
};
