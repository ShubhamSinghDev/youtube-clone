import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import VideoCard from '../components/VideoCard';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Music', 'Gaming', 'Education', 'Entertainment', 'News', 'Sports', 'Technology'];

  useEffect(() => {
    fetchVideos();
  }, [searchParams]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      
      let url = '/videos';
      const params = new URLSearchParams();
      
      if (category) {
        params.append('category', category);
        setActiveFilter(category);
      }
      if (search) {
        params.append('search', search);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await API.get(url);
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = async (filter) => {
    setActiveFilter(filter);
    try {
      setLoading(true);
      let url = '/videos';
      if (filter !== 'All') {
        url += `?category=${filter}`;
      }
      const { data } = await API.get(url);
      setVideos(data);
    } catch (error) {
      console.error('Error filtering videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="loading">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {videos.length === 0 ? (
        <div className="no-videos">
          <p>No videos found</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
