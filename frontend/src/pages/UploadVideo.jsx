import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import './UploadVideo.css';

const UploadVideo = () => {
  const { channelId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Other'
  });
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Music', 'Gaming', 'Education', 'Entertainment', 'News', 'Sports', 'Technology', 'Other'];

  useEffect(() => {
    fetchChannel();
  }, [channelId]);

  const fetchChannel = async () => {
    try {
      const { data } = await API.get(`/channels/${channelId}`);
      if (data.owner._id !== user._id) {
        navigate('/');
        return;
      }
      setChannel(data);
    } catch (error) {
      console.error('Error fetching channel:', error);
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.videoUrl.trim() || !formData.thumbnailUrl.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post('/videos', {
        ...formData,
        channelId
      });
      alert('Video uploaded successfully!');
      navigate(`/channel/${channelId}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading video');
    } finally {
      setLoading(false);
    }
  };

  if (!channel) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="upload-video">
      <div className="upload-container">
        <h1>Upload Video to {channel.channelName}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              maxLength={100}
              required
            />
            <small>{formData.title.length}/100</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell viewers about your video"
              rows="6"
              maxLength={5000}
            />
            <small>{formData.description.length}/5000</small>
          </div>

          <div className="form-group">
            <label htmlFor="videoUrl">
              Video URL (YouTube Embed URL) <span className="required">*</span>
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              required
            />
            <small>Example: https://www.youtube.com/embed/dQw4w9WgXcQ</small>
          </div>

          <div className="form-group">
            <label htmlFor="thumbnailUrl">
              Thumbnail URL <span className="required">*</span>
            </label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
              required
            />
            {formData.thumbnailUrl && (
              <div className="thumbnail-preview">
                <img src={formData.thumbnailUrl} alt="Thumbnail preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(`/channel/${channelId}`)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
