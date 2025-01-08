import { RequestHandler } from 'express';

import { AppError } from '../../common/errors/app.error.js';
import { Post } from '../../common/models/post.model.js';
import { createResponse } from '../../common/utils/response.handler.js';
import { FetchAllPostsQuery } from '../../common/validation/project.zod.js';
import { addCommentSchema } from '../../models/comment.model.js';
import { addPostService } from './services/post.add.service.js';
import { fetchAllPostsService } from './services/post.get.all.service.js';

export const handleAddPost: RequestHandler = async (req, res, next) => {
  const mongoRef = res.locals.mongoRef;
  const validatedData = req.body;

  console.log(validatedData);

  try {
    const post = await addPostService(mongoRef, validatedData);
    res.status(201).json(createResponse(true, post));
  } catch (error) {
    next(error);
  }
};
export const handleFetchAllPosts: RequestHandler = async (req, res, next) => {
  try {
    const { limit, page } = req.query as FetchAllPostsQuery;
    const userId = res.locals.userId.userId; // Adjust if your middleware sets res.locals differently

    const posts = await fetchAllPostsService({ limit, page }, userId);
    res.status(200).json(createResponse(true, posts));
  } catch (error) {
    next(error);
  }
};

export const handleLikePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.body;
  const userId = res.locals.userId.userId; // Adjust if your middleware sets res.locals differently
  console.log('Toggling like for postId:', postId, 'by userId:', userId);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check if user already liked
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // Return the updated post with `likedByUser` and `likesCount`
    const likedByUser = post.likes.some((likeId) => likeId.toString() === userId);
    res.status(200).json({
      success: true,
      post: {
        ...post.toObject(),
        likedByUser,
        likesCount: post.likes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleAddComment: RequestHandler = async (req, res, next) => {
  try {
    // Validate incoming data with Zod
    const { postId, text } = addCommentSchema.parse(req.body);

    const userId = res.locals.userId.userId; // the ID from your auth middleware

    const post = await Post.findById(postId).populate({
      path: 'comments.userId',
      select: 'username profilePicture',
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // push a new subdocument to the comments array
    post.comments.push({
      userId,
      text,
      createdAt: new Date(),
    });

    await post.save();

    // Optionally populate the newly added comment
    const updatedPost = await Post.findById(postId)
      .populate({
        path: 'comments.userId',
        select: 'username profilePicture',
      })
      .populate({
        path: 'userId', // if you also want to populate the post's author
        select: 'username profilePicture',
      })
      .exec();

    res.status(200).json(
      createResponse(true, {
        post: updatedPost,
      }),
    );
  } catch (error) {
    next(error);
  }
};
