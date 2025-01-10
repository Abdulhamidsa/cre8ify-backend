import { Router } from 'express';

import { ValidZod } from '../../../common/middleware/zod.middleware.js';
import { addPostSchema } from '../../../common/validation/post.zod.js';
import { fetchAllPostsSchema } from '../../../common/validation/project.zod.js';
import { handleAddComment, handleAddPost, handleFetchAllPosts, handleLikePost } from '../post.handlers.js';

const router = Router();

// add post
router.post('/post', ValidZod(addPostSchema, 'body'), handleAddPost);
// all posts
router.get('/posts', ValidZod(fetchAllPostsSchema, 'query'), handleFetchAllPosts);

router.post('/post/like', handleLikePost);
router.post('/post/comment', handleAddComment);

export default router;
