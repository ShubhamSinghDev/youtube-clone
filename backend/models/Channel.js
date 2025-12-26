import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: [true, 'Channel name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Channel name must be at least 3 characters'],
    maxlength: [50, 'Channel name cannot exceed 50 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  channelBanner: {
    type: String,
    default: 'https://via.placeholder.com/1920x1080/4A90E2/ffffff?text=Channel+Banner'
  },
  subscribers: {
    type: Number,
    default: 0
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
