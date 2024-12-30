import cloudinary from './cloudinary.config';

export const uploadImage = async (imageUrl: string, folder: string, transformations: object) => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder,
    format: 'webp',
    transformation: transformations,
  });
  return result.secure_url;
};
