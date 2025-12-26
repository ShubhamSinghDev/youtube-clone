import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// @desc    Create new video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;

    // Validation
    if (!title || !videoUrl || !thumbnailUrl || !channelId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if channel exists and user owns it
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to upload to this channel' });
    }

    // Create video
    const video = await Video.create({
      title,
      description: description || '',
      videoUrl,
      thumbnailUrl,
      category: category || 'Other',
      channelId,
      uploader: req.user._id
    });

    // Add video to channel's videos array
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: video._id }
    });

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getAllVideos = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const videos = await Video.find(query)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar')
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar')
      .populate('comments.userId', 'username avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this video' });
    }

    const { title, description, thumbnailUrl, category } = req.body;

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (category) video.category = category;

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    // Remove video from channel's videos array
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id }
    });

    await video.deleteOne();

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like/Unlike video
// @route   POST /api/videos/:id/like
// @access  Private
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id;

    // Check if already liked
    const alreadyLiked = video.likedBy.includes(userId);
    const alreadyDisliked = video.dislikedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike
      video.likes -= 1;
      video.likedBy = video.likedBy.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      video.likes += 1;
      video.likedBy.push(userId);

      // Remove dislike if exists
      if (alreadyDisliked) {
        video.dislikes -= 1;
        video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId.toString());
      }
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Dislike/Undislike video
// @route   POST /api/videos/:id/dislike
// @access  Private
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id;

    // Check if already disliked
    const alreadyDisliked = video.dislikedBy.includes(userId);
    const alreadyLiked = video.likedBy.includes(userId);

    if (alreadyDisliked) {
      // Undislike
      video.dislikes -= 1;
      video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId.toString());
    } else {
      // Dislike
      video.dislikes += 1;
      video.dislikedBy.push(userId);

      // Remove like if exists
      if (alreadyLiked) {
        video.likes -= 1;
        video.likedBy = video.likedBy.filter(id => id.toString() !== userId.toString());
      }
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add comment to video
// @route   POST /api/videos/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = {
      userId: req.user._id,
      text: text.trim(),
      timestamp: new Date()
    };

    video.comments.push(comment);
    await video.save();

    // Populate the comment with user info before sending response
    await video.populate('comments.userId', 'username avatar');

    res.status(201).json(video.comments[video.comments.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/videos/:id/comments/:commentId
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = video.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.text = text.trim();
    await video.save();

    await video.populate('comments.userId', 'username avatar');

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/videos/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = video.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await video.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
