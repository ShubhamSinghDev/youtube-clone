import { Link } from 'react-router-dom';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffTime = Math.abs(now - uploadDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <div className="video-thumbnail">
        <img src={video.thumbnailUrl} alt={video.title} />
      </div>
      <div className="video-info">
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <div className="video-meta">
            <span className="channel-name">
              {video.channelId?.channelName || 'Unknown Channel'}
            </span>
            <div className="video-stats">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{getTimeAgo(video.uploadDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
