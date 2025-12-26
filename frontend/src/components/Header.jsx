import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaSearch, FaUserCircle, FaVideo } from 'react-icons/fa';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Link to="/" className="logo">
          <FaVideo className="logo-icon" />
          <span>YouTube Clone</span>
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <FaSearch />
        </button>
      </form>

      <div className="header-right">
        {user ? (
          <div className="user-menu">
            <button 
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <FaUserCircle size={32} />
              )}
            </button>
            {showUserMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <img src={user.avatar} alt={user.username} />
                  <div>
                    <div className="dropdown-username">{user.username}</div>
                    <div className="dropdown-email">{user.email}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link 
                  to="/channels/my-channels" 
                  className="dropdown-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  My Channels
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="signin-btn">
            <FaUserCircle size={24} />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
