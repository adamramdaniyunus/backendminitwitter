import express from 'express';
import { followUser, forgotPassword, getAllUser, getUser, unfollowUser, updateUser } from '../controllers/userController.js';
import { Login, Register } from '../controllers/authController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createPost, deletePost, getAllPost, getPost, likePost, timelinePost, updatePost } from '../controllers/postController.js';

const router = express.Router();

router.get('/user/:id', authMiddleware, getUser);
router.get('/user', getAllUser);
router.patch('/user/:id', updateUser);
router.patch('/password', forgotPassword);
router.post('/follow/:id', followUser);
router.post('/unfollow/:id', unfollowUser);
router.post('/register', Register);
router.post('/login', Login);
router.post('/post', createPost);
router.get('/post/:id', getPost);
router.get('/post', getAllPost);
router.patch('/post/:id', updatePost);
router.delete('/post/:id', deletePost);
router.post('/liked/:id', likePost);
router.get('/post/:id/timeline', timelinePost);


export default router;