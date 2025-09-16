import express from 'express';
const router = express.Router();
import { createPost, getPosts, getPostById, deletePost } from '../controllers/PostController.js';
import { authenticate } from '../middleware/AuthMiddleware.js';

router.post('/new', authenticate, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.delete('/:id', authenticate, deletePost);

export default router;
