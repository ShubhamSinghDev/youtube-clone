import { Link } from 'react-router-dom';
import { FaHome, FaFire, FaMusic, FaGamepad, FaNewspaper, FaTrophy, FaGraduationCap } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: <FaHome />, text: 'Home', path: '/' },
    { icon: <FaFire />, text: 'Trending', path: '/?category=Entertainment' },
    { icon: <FaMusic />, text: 'Music', path: '/?category=Music' },
    { icon: <FaGamepad />, text: 'Gaming', path: '/?category=Gaming' },
    { icon: <FaNewspaper />, text: 'News', path: '/?category=News' },
    { icon: <FaTrophy />, text: 'Sports', path: '/?category=Sports' },
    { icon: <FaGraduationCap />, text: 'Education', path: '/?category=Education' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} className="sidebar-item">
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
