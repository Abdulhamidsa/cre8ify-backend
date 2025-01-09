import { AppError } from '../../../common/errors/app.error.js';
import { Post } from '../../../common/models/post.model.js';
import { PostType } from '../../../common/types/types.js';

export const fetchAllPostsService = async (
  { limit = 10, page = 1 }: { limit?: number; page?: number },
  userId: string,
): Promise<{ posts: PostType[]; totalPages: number; currentPage: number }> => {
  const query: Record<string, unknown> = {};

  try {
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const options = {
      limit,
      skip: (page - 1) * limit,
    };

    const posts = await Post.find(query, null, options)
      .populate([
        { path: 'userId', select: '_id username profilePicture' },
        { path: 'comments.userId', select: '_id username profilePicture' },
      ])
      .lean();

    const mappedPosts = posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      likedByUser: post.likes.some((likeId) => likeId.toString() === userId),
      likesCount: post.likes.length,
    })) as unknown as PostType[];

    return {
      posts: mappedPosts,
      totalPages,
      currentPage: page,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new AppError('Failed to fetch posts', 500);
  }
};
