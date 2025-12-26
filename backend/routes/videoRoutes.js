import express from 'express';
import {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  addComment,
  updateComment,
  deleteComment
} from '../controllers/videoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllVideos)
  .post(protect, createVideo);

router.route('/:id')
  .get(getVideoById)
  .put(protect, updateVideo)
  .delete(protect, deleteVideo);

router.post('/:id/like', protect, likeVideo);
router.post('/:id/dislike', protect, dislikeVideo);

router.route('/:id/comments')
  .post(protect, addComment);

router.route('/:id/comments/:commentId')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router;
