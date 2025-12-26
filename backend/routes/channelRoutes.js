import express from 'express';
import {
  createChannel,
  getAllChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
  getUserChannels
} from '../controllers/channelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllChannels)
  .post(protect, createChannel);

router.route('/:id')
  .get(getChannelById)
  .put(protect, updateChannel)
  .delete(protect, deleteChannel);

router.get('/user/:userId', getUserChannels);

export default router;
