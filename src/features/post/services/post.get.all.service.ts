import { AppError } from '../../../common/errors/app.error.js';
import { Post } from '../../../common/models/post.model.js';
import { PostType } from '../../../common/types/types.js';

export const fetchAllPostsService = async (
  { limit, page }: { limit?: number; page?: number },
  userId: string,
): Promise<PostType[]> => {
  try {
    const query = {};
    const options = {
      limit: limit || 10,
      skip: page ? (page - 1) * (limit || 10) : 0,
    };

    const posts = await Post.find(query, null, options)
      .populate<{
        userId: { _id: string; username: string; profilePicture: string };
        comments: Array<{
          userId: { _id: string; username: string; profilePicture: string };
        }>;
      }>([
        { path: 'userId', select: 'username profilePicture' },
        { path: 'comments.userId', select: 'username profilePicture' },
      ])
      .lean();

    if (!posts || posts.length === 0) {
      throw new AppError('No posts found', 404);
    }

    return posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      likedByUser: post.likes.some((likeId) => likeId.toString() === userId),
      likesCount: post.likes.length,
    })) as PostType[];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch posts', 500);
  }
};
