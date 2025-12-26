import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaVideo } from 'react-icons/fa';
import './MyChannels.css';

const MyChannels = () => {
  const { user } = useContext(AuthContext);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannel, setNewChannel] = useState({ channelName: '', description: '' });

  useEffect(() => {
    if (user) {
      fetchChannels();
    }
  }, [user]);

  const fetchChannels = async () => {
    try {
      const { data } = await API.get(`/channels/user/${user._id}`);
      setChannels(data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannel.channelName.trim()) return;

    try {
      const { data } = await API.post('/channels', newChannel);
      setChannels([...channels, data]);
      setNewChannel({ channelName: '', description: '' });
      setShowCreateModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating channel');
    }
  };

  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm('Are you sure you want to delete this channel?')) return;

    try {
      await API.delete(`/channels/${channelId}`);
      setChannels(channels.filter(c => c._id !== channelId));
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting channel');
    }
  };

  if (!user) {
    return (
      <div className="my-channels">
        <div className="empty-state">
          <p>Please login to manage channels</p>
          <Link to="/login" className="primary-btn">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading channels...</div>;
  }

  return (
    <div className="my-channels">
      <div className="page-header">
        <h1>My Channels</h1>
        <button className="primary-btn" onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Create Channel
        </button>
      </div>

      {channels.length === 0 ? (
        <div className="empty-state">
          <FaVideo size={64} />
          <h2>No channels yet</h2>
          <p>Create your first channel to start uploading videos</p>
          <button className="primary-btn" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Create Channel
          </button>
        </div>
      ) : (
        <div className="channels-grid">
          {channels.map((channel) => (
            <div key={channel._id} className="channel-card">
              <div className="channel-banner">
                <img src={channel.channelBanner} alt={channel.channelName} />
              </div>
              <div className="channel-info">
                <h3>{channel.channelName}</h3>
                <p className="channel-description">{channel.description || 'No description'}</p>
                <div className="channel-stats">
                  <span>{channel.subscribers} subscribers</span>
                  <span>•</span>
                  <span>{channel.videos.length} videos</span>
                </div>
                <div className="channel-actions">
                  <Link to={`/channel/${channel._id}`} className="action-btn">
                    View Channel
                  </Link>
                  <Link to={`/channel/${channel._id}/upload`} className="action-btn primary">
                    <FaVideo /> Upload Video
                  </Link>
                  <button
                    onClick={() => handleDeleteChannel(channel._id)}
                    className="action-btn danger"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Channel</h2>
            <form onSubmit={handleCreateChannel}>
              <div className="form-group">
                <label>Channel Name</label>
                <input
                  type="text"
                  value={newChannel.channelName}
                  onChange={(e) => setNewChannel({ ...newChannel, channelName: e.target.value })}
                  placeholder="Enter channel name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                  placeholder="Describe your channel"
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChannels;
