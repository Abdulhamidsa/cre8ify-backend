import { AppError } from '../../../common/errors/app.error.js';
import { Post } from '../../../common/models/post.model.js';
import { PostType } from '../../../common/types/types.js';

export const fetchAllPostsService = async ({ limit, page }: { limit?: number; page?: number }): Promise<PostType[]> => {
  try {
    const query = {};
    const options = {
      limit: limit || 10,
      skip: page ? (page - 1) * (limit || 10) : 0,
    };

    const posts = await Post.find(query, null, options)
      .populate<{
        userId: { _id: string; username: string; profilePicture: string };
      }>('userId', 'username profilePicture')
      .lean();

    if (!posts || posts.length === 0) {
      throw new AppError('No posts found', 404);
    }

    return posts.map((post) => ({
      ...post,
      id: post._id.toString(), // Convert `_id` to `id`
    })) as PostType[]; // Assert type compatibility explicitly
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch posts', 500);
  }
};
