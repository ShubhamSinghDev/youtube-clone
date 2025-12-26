
Git Link:- https://github.com/ShubhamSinghDev/youtube-clone.git
# YouTube Clone - MERN Stack
A full-stack YouTube clone application built with MongoDB, Express.js, React.js, and Node.js.

## 🎯 Features

### User Authentication
- User registration with validation
- JWT-based secure login
- Protected routes and authorization
- User profile management

### Video Management
- Browse videos with thumbnails
- Watch videos with embedded player
- Like and dislike videos
- View count tracking
- Video categorization (Music, Gaming, Education, etc.)
- Search videos by title
- Filter videos by category

### Channel Management
- Create multiple channels
- Upload videos to channels
- Edit and delete your videos
- Channel page with all videos
- Channel statistics (subscribers, video count)

### Comments System
- Add comments on videos
- Edit your own comments
- Delete your own comments
- View comments with user information

### Responsive Design
- Fully responsive across devices
- Mobile-friendly interface
- Adaptive layouts for different screen sizes

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP requests
- **React Icons** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd youtube-clone
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system.

**Seed the database with sample data:**

```bash
# From backend directory
cd backend
node seed.js
```

This will create:
- 2 sample users
- 2 channels
- 8 sample videos with comments

**Test Login Credentials:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

## 🏃 Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
youtube-clone/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── channelController.js  # Channel CRUD operations
│   │   └── videoController.js    # Video & comment operations
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Channel.js            # Channel schema
│   │   └── Video.js              # Video & Comment schemas
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── channelRoutes.js      # Channel endpoints
│   │   └── videoRoutes.js        # Video endpoints
│   ├── .env.example              # Environment variables template
│   ├── seed.js                   # Database seeding script
│   ├── server.js                 # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx        # Navigation header
    │   │   ├── Sidebar.jsx       # Sidebar navigation
    │   │   └── VideoCard.jsx     # Video thumbnail card
    │   ├── pages/
    │   │   ├── Home.jsx          # Homepage with video grid
    │   │   ├── VideoPlayer.jsx   # Video player page
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Register.jsx      # Registration page
    │   │   ├── MyChannels.jsx    # User's channels
    │   │   ├── Channel.jsx       # Channel detail page
    │   │   └── UploadVideo.jsx   # Video upload form
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── utils/
    │   │   └── api.js            # Axios configuration
    │   ├── styles/
    │   │   └── App.css           # Global styles
    │   ├── App.jsx               # Main app component
    │   └── main.jsx              # React entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Channels
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create channel (Protected)
- `GET /api/channels/:id` - Get channel by ID
- `PUT /api/channels/:id` - Update channel (Protected)
- `DELETE /api/channels/:id` - Delete channel (Protected)
- `GET /api/channels/user/:userId` - Get user's channels

### Videos
- `GET /api/videos` - Get all videos (with search & filter)
- `POST /api/videos` - Upload video (Protected)
- `GET /api/videos/:id` - Get video by ID
- `PUT /api/videos/:id` - Update video (Protected)
- `DELETE /api/videos/:id` - Delete video (Protected)
- `POST /api/videos/:id/like` - Like/unlike video (Protected)
- `POST /api/videos/:id/dislike` - Dislike/undislike video (Protected)

### Comments
- `POST /api/videos/:id/comments` - Add comment (Protected)
- `PUT /api/videos/:id/comments/:commentId` - Update comment (Protected)
- `DELETE /api/videos/:id/comments/:commentId` - Delete comment (Protected)

## 🎨 Key Features Implementation

### Search & Filter
- Search videos by title using query parameter: `/?search=query`
- Filter by category: `/?category=Music`
- Real-time filtering on homepage

### Authentication Flow
1. User registers with username, email, and password
2. Password is hashed using bcrypt
3. JWT token is generated and sent to client
4. Token is stored in localStorage
5. Token is sent with every protected request
6. Backend verifies token and authorizes user

### Video Upload Process
1. User must be logged in
2. User must create a channel first
3. Navigate to channel and click "Upload Video"
4. Provide video details (YouTube embed URL, thumbnail, etc.)
5. Video is linked to the channel
6. Video appears on channel page and homepage

### Like/Dislike System
- Users can like or dislike videos
- Clicking like removes dislike (and vice versa)
- Clicking again removes the reaction
- Counts are updated in real-time

### Comments Management
- Full CRUD operations for comments
- Users can only edit/delete their own comments
- Comments show user avatar and username
- Timestamps for each comment

## 🎯 Usage Guide

### Creating Your First Channel

1. Register or login to the application
2. Click on your profile icon → "My Channels"
3. Click "Create Channel" button
4. Enter channel name and description
5. Your channel is created!

### Uploading a Video

1. Go to "My Channels"
2. Click "Upload Video" on your channel
3. Fill in video details:
   - **Title**: Your video title
   - **Description**: Video description
   - **Video URL**: YouTube embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`)
   - **Thumbnail URL**: Direct image URL
   - **Category**: Select appropriate category
4. Click "Upload Video"

### Finding YouTube Embed URLs

1. Go to any YouTube video
2. Click "Share" button
3. Click "Embed"
4. Copy the URL from the `src` attribute
5. Example: `https://www.youtube.com/embed/dQw4w9WgXcQ`

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration with validation
- [ ] User login and logout
- [ ] Create new channel
- [ ] Upload video to channel
- [ ] Edit video details
- [ ] Delete video
- [ ] Search videos by title
- [ ] Filter videos by category
- [ ] Like and dislike videos
- [ ] Add, edit, delete comments
- [ ] Responsive design on mobile
- [ ] Protected routes (redirect to login)

## 🚨 Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check if the connection string in `.env` is correct
- Verify MongoDB is accessible on port 27017

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Modify `server.port` in `vite.config.js`

### CORS Errors
- Backend CORS is configured to accept all origins in development
- For production, update CORS settings in `server.js`

### Videos Not Loading
- Verify video URLs are YouTube embed URLs
- Check if videos are publicly accessible
- Ensure thumbnail URLs are valid image URLs

## 🔐 Security Considerations

### Implemented
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation on backend
- Authorization checks for user actions

### For Production
- Use HTTPS
- Set secure JWT secrets
- Implement rate limiting
- Add input sanitization
- Use environment-specific CORS
- Implement refresh tokens
- Add CSRF protection

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/...   # MongoDB connection
JWT_SECRET=your_secret_key                   # JWT signing key
JWT_EXPIRE=7d                                # Token expiration
NODE_ENV=development                         # Environment
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- JWT authentication
- MongoDB database design
- React state management
- Component-based architecture
- Responsive web design
- CRUD operations
- File structure organization
- Git version control

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check existing issues for solutions

## 🎉 Acknowledgments

- YouTube for inspiration
- MERN stack community
- All contributors and testers

---

**Happy Coding! 🚀**
