import { Router } from 'express';

import { ValidZod } from '../../../common/middleware/zod.middleware.js';
import { addPostSchema } from '../../../common/validation/post.zod.js';
import { fetchAllPostsSchema } from '../../../common/validation/project.zod.js';
import { handleAddPost, handleFetchAllPosts } from '../post.handlers.js';

const router = Router();

// add post
router.post('/post', ValidZod(addPostSchema, 'body'), handleAddPost);
// all posts
router.get('/post', ValidZod(fetchAllPostsSchema, 'query'), handleFetchAllPosts);

export default router;
