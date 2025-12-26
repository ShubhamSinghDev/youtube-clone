import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import VideoCard from '../components/VideoCard';
import './Channel.css';

const Channel = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const fetchChannel = async () => {
    try {
      const { data } = await API.get(`/channels/${id}`);
      setChannel(data);
    } catch (error) {
      console.error('Error fetching channel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading channel...</div>;
  }

  if (!channel) {
    return <div className="error">Channel not found</div>;
  }

  const isOwner = user && user._id === channel.owner._id;

  return (
    <div className="channel-page">
      <div className="channel-header">
        <div className="channel-banner-img">
          <img src={channel.channelBanner} alt={channel.channelName} />
        </div>
        <div className="channel-info-header">
          <div className="channel-details">
            <h1>{channel.channelName}</h1>
            <div className="channel-meta">
              <span>@{channel.owner.username}</span>
              <span>•</span>
              <span>{channel.subscribers} subscribers</span>
              <span>•</span>
              <span>{channel.videos.length} videos</span>
            </div>
            {channel.description && (
              <p className="channel-desc">{channel.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="channel-content">
        <div className="content-header">
          <h2>Videos</h2>
        </div>

        {channel.videos.length === 0 ? (
          <div className="no-videos">
            <p>{isOwner ? 'You haven\'t uploaded any videos yet' : 'No videos available'}</p>
          </div>
        ) : (
          <div className="video-grid">
            {channel.videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
