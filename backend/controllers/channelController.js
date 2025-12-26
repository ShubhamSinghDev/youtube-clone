import Channel from '../models/Channel.js';
import User from '../models/User.js';

// @desc    Create new channel
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    // Validation
    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    // Check if channel name exists
    const channelExists = await Channel.findOne({ channelName });
    if (channelExists) {
      return res.status(400).json({ message: 'Channel name already exists' });
    }

    // Create channel
    const channel = await Channel.create({
      channelName,
      description: description || '',
      channelBanner: channelBanner || `https://via.placeholder.com/1920x1080/4A90E2/ffffff?text=${channelName}`,
      owner: req.user._id
    });

    // Add channel to user's channels array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id }
    });

    res.status(201).json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all channels
// @route   GET /api/channels
// @access  Public
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate('owner', 'username avatar')
      .populate('videos');
    res.json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get channel by ID
// @route   GET /api/channels/:id
// @access  Public
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        options: { sort: { uploadDate: -1 } }
      });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update channel
// @route   PUT /api/channels/:id
// @access  Private
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check ownership
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this channel' });
    }

    const { channelName, description, channelBanner } = req.body;

    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner) channel.channelBanner = channelBanner;

    const updatedChannel = await channel.save();
    res.json(updatedChannel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete channel
// @route   DELETE /api/channels/:id
// @access  Private
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check ownership
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this channel' });
    }

    await channel.deleteOne();

    // Remove channel from user's channels array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { channels: channel._id }
    });

    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's channels
// @route   GET /api/channels/user/:userId
// @access  Public
export const getUserChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.params.userId })
      .populate('owner', 'username avatar')
      .populate('videos');
    res.json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
