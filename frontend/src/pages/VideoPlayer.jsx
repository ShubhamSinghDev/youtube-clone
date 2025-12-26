import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const { data } = await API.get(`/videos/${id}`);
      setVideo(data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like videos');
      return;
    }
    try {
      const { data } = await API.post(`/videos/${id}/like`);
      setVideo({ ...video, likes: data.likes, dislikes: data.dislikes });
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('Please login to dislike videos');
      return;
    }
    try {
      const { data } = await API.post(`/videos/${id}/dislike`);
      setVideo({ ...video, likes: data.likes, dislikes: data.dislikes });
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const { data } = await API.post(`/videos/${id}/comments`, { text: newComment });
      setVideo({
        ...video,
        comments: [...video.comments, data]
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const { data } = await API.put(`/videos/${id}/comments/${commentId}`, { text: editText });
      setVideo({
        ...video,
        comments: video.comments.map(c => c._id === commentId ? data : c)
      });
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await API.delete(`/videos/${id}/comments/${commentId}`);
      setVideo({
        ...video,
        comments: video.comments.filter(c => c._id !== commentId)
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  if (!video) {
    return <div className="error">Video not found</div>;
  }

  return (
    <div className="video-player-page">
      <div className="video-container">
        <div className="video-wrapper">
          <iframe
            src={video.videoUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-info-section">
          <h1 className="video-title">{video.title}</h1>
          
          <div className="video-actions">
            <div className="channel-info">
              <Link to={`/channel/${video.channelId._id}`} className="channel-link">
                <h3>{video.channelId.channelName}</h3>
                <span>{video.channelId.subscribers} subscribers</span>
              </Link>
            </div>

            <div className="action-buttons">
              <button onClick={handleLike} className="action-btn">
                <FaThumbsUp /> {video.likes}
              </button>
              <button onClick={handleDislike} className="action-btn">
                <FaThumbsDown /> {video.dislikes}
              </button>
            </div>
          </div>

          <div className="video-description">
            <div className="description-header">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDate(video.uploadDate)}</span>
            </div>
            <p>{video.description || 'No description available'}</p>
          </div>
        </div>

        <div className="comments-section">
          <h3>{video.comments.length} Comments</h3>

          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <img src={user.avatar} alt={user.username} className="comment-avatar" />
              <div className="comment-input-wrapper">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="comment-actions">
                  <button type="button" onClick={() => setNewComment('')}>Cancel</button>
                  <button type="submit">Comment</button>
                </div>
              </div>
            </form>
          )}

          <div className="comments-list">
            {video.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <img 
                  src={comment.userId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                  alt={comment.userId?.username} 
                  className="comment-avatar" 
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.userId?.username || 'Unknown User'}</span>
                    <span className="comment-date">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {editingComment === comment._id ? (
                    <div className="edit-comment">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="edit-actions">
                        <button onClick={() => setEditingComment(null)}>Cancel</button>
                        <button onClick={() => handleEditComment(comment._id)}>Save</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="comment-text">{comment.text}</p>
                      {user && user._id === comment.userId?._id && (
                        <div className="comment-buttons">
                          <button
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditText(comment.text);
                            }}
                            className="icon-btn"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="icon-btn delete"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
