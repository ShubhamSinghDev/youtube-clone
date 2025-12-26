import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleVideos = [
  {
    title: "Learn React in 30 Minutes",
    description: "A quick tutorial to get started with React. Perfect for beginners!",
    videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
    thumbnailUrl: "https://i.ytimg.com/vi/SqcY0GlETPk/maxresdefault.jpg",
    category: "Education",
    views: 15200,
    likes: 1023,
    dislikes: 45
  },
  {
    title: "JavaScript Tips and Tricks",
    description: "Learn advanced JavaScript techniques that will improve your coding skills.",
    videoUrl: "https://www.youtube.com/embed/Mus_vwhTCq0",
    thumbnailUrl: "https://i.ytimg.com/vi/Mus_vwhTCq0/maxresdefault.jpg",
    category: "Technology",
    views: 23400,
    likes: 1890,
    dislikes: 32
  },
  {
    title: "Building Full Stack Apps with MERN",
    description: "Complete guide to building modern web applications using MongoDB, Express, React, and Node.js.",
    videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
    thumbnailUrl: "https://i.ytimg.com/vi/7CqJlxBYj-M/maxresdefault.jpg",
    category: "Education",
    views: 45600,
    likes: 3421,
    dislikes: 67
  },
  {
    title: "Top 10 Gaming Moments",
    description: "The most epic gaming moments from this year!",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    category: "Gaming",
    views: 89000,
    likes: 5234,
    dislikes: 123
  },
  {
    title: "Relaxing Music for Study",
    description: "2 hours of peaceful music perfect for studying or working.",
    videoUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    thumbnailUrl: "https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg",
    category: "Music",
    views: 234000,
    likes: 12340,
    dislikes: 234
  },
  {
    title: "Latest Tech News",
    description: "Stay updated with the latest technology news and updates.",
    videoUrl: "https://www.youtube.com/embed/QwoghxwETng",
    thumbnailUrl: "https://i.ytimg.com/vi/QwoghxwETng/maxresdefault.jpg",
    category: "News",
    views: 12300,
    likes: 890,
    dislikes: 45
  },
  {
    title: "Football Highlights 2024",
    description: "Best football moments and goals from 2024 season.",
    videoUrl: "https://www.youtube.com/embed/EngW7tLk6R8",
    thumbnailUrl: "https://i.ytimg.com/vi/EngW7tLk6R8/maxresdefault.jpg",
    category: "Sports",
    views: 67800,
    likes: 4532,
    dislikes: 234
  },
  {
    title: "Comedy Stand Up Special",
    description: "Hilarious stand-up comedy performance that will make you laugh!",
    videoUrl: "https://www.youtube.com/embed/qtsNbxgPngA",
    thumbnailUrl: "https://i.ytimg.com/vi/qtsNbxgPngA/maxresdefault.jpg",
    category: "Entertainment",
    views: 156000,
    likes: 8900,
    dislikes: 456
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();

    console.log('Cleared existing data');

    // Create users
    const user1 = await User.create({
      username: 'JohnDoe',
      email: 'john@example.com',
      password: 'password123',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe'
    });

    const user2 = await User.create({
      username: 'JaneSmith',
      email: 'jane@example.com',
      password: 'password123',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaneSmith'
    });

    console.log('Users created');

    // Create channels
    const channel1 = await Channel.create({
      channelName: 'Code with John',
      owner: user1._id,
      description: 'Coding tutorials and tech reviews by John Doe.',
      channelBanner: 'https://via.placeholder.com/1920x1080/4A90E2/ffffff?text=Code+with+John',
      subscribers: 5200
    });

    const channel2 = await Channel.create({
      channelName: 'Jane\'s Gaming World',
      owner: user2._id,
      description: 'Gaming videos, reviews, and entertainment.',
      channelBanner: 'https://via.placeholder.com/1920x1080/E24A90/ffffff?text=Gaming+World',
      subscribers: 12400
    });

    console.log('Channels created');

    // Update users with channels
    user1.channels.push(channel1._id);
    await user1.save();

    user2.channels.push(channel2._id);
    await user2.save();

    // Create videos
    const videos = [];
    
    for (let i = 0; i < sampleVideos.length; i++) {
      const videoData = sampleVideos[i];
      const channel = i % 2 === 0 ? channel1 : channel2;
      const uploader = i % 2 === 0 ? user1 : user2;

      const video = await Video.create({
        ...videoData,
        channelId: channel._id,
        uploader: uploader._id,
        comments: [
          {
            userId: i % 2 === 0 ? user2._id : user1._id,
            text: 'Great video! Very helpful.',
            timestamp: new Date()
          }
        ]
      });

      videos.push(video);

      // Add video to channel
      channel.videos.push(video._id);
      await channel.save();
    }

    console.log('Videos created');
    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Users:');
    console.log('1. Email: john@example.com, Password: password123');
    console.log('2. Email: jane@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
