import { AppError } from '../../../common/errors/app.error.js';
import { Post } from '../../../common/models/post.model.js';
import { PostType } from '../../../common/types/types.js';

export const fetchAllPostsService = async (
  { limit = 10, page = 1 }: { limit?: number; page?: number },
  userId: string,
): Promise<{ posts: PostType[]; totalPages: number; currentPage: number }> => {
  const query: Record<string, unknown> = {};

  try {
    // Count the total number of posts matching the query
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    // If no posts exist, return an empty response
    if (totalPosts === 0) {
      return {
        posts: [],
        totalPages: 0,
        currentPage: 1,
      };
    }

    // Pagination options
    const options = {
      limit,
      skip: (page - 1) * limit,
    };

    // Fetch the posts
    const posts = await Post.find(query, null, options)
      .populate([
        { path: 'userId', select: '_id username profilePicture' },
        { path: 'comments.userId', select: '_id username profilePicture' },
      ])
      .lean();

    // Map posts with additional fields
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
  } catch (error) {
    console.error('Service Error:', error); // Log the actual error
    throw new AppError('Failed to fetch posts', 500);
  }
};
