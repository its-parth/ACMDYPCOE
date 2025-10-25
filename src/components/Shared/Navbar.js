import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

const Navbar = ({ links }) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={currentUser?.role === 'admin' ? '/admin' : '/member'} className="navbar-brand">
          <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="50" rx="12" fill="#0066cc"/>
            <path d="M15 35L25 15L35 35M19 28H31" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>ACM Club</span>
        </Link>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <img 
                src={currentUser?.profilePhoto} 
                alt={currentUser?.name} 
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">{currentUser?.name}</span>
                <span className="user-role">{currentUser?.role === 'admin' ? 'Administrator' : 'Member'}</span>
              </div>
            </div>
            <button onClick={logout} className="btn btn-secondary logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
