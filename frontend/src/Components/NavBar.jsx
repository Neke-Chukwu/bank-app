import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const location = useLocation(); // Get the current route

  // Update activeTab based on the current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('home');
    } else if (path === '/services') {
      setActiveTab('services');
    } else if (path === '/about') {
      setActiveTab('about');
    } else if (path === '/contact') {
      setActiveTab('contact');
    } else {
      setActiveTab(null); // No active tab for login, register, or other pages
    }
  }, [location]);

  // Disable or enable page scroll when the menu is toggled
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false); // Close the menu on mobile when a tab is clicked
  };

  const handleButtonClick = () => {
    setActiveTab(null); // Disable active state for navigation links
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        {/* Logo */}
        <a href="/" className="navbar-brand d-flex align-items-center">
          <i className="fas fa-landmark me-2" style={{ color: '#1A3D8F' }}></i>
          <span className="fw-bold" style={{ color: '#1A3D8F' }}>Neon Trust Bank</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ outline: 'none', boxShadow: 'none' }} // Remove focus outline
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show fade-in' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="/"
                onClick={() => handleTabChange('home')}
                className={`nav-link ${activeTab === 'home' ? 'active-tab' : ''}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                onClick={() => handleTabChange('services')}
                className={`nav-link ${activeTab === 'services' ? 'active-tab' : ''}`}
              >
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                onClick={() => handleTabChange('about')}
                className={`nav-link ${activeTab === 'about' ? 'active-tab' : ''}`}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                onClick={() => handleTabChange('contact')}
                className={`nav-link ${activeTab === 'contact' ? 'active-tab' : ''}`}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Buttons */}
          <div className="d-flex ms-md-3 mt-5 mt-md-0">
            <Link
              to="/login"
              onClick={() => {
                handleButtonClick();
                setIsMenuOpen(false);
              }}
              style={{ backgroundColor: '#1A3D8F', color: '#FFFFFF' }}
              className="btn btn me-2"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => {
                handleButtonClick();
                setIsMenuOpen(false);
              }}
              style={{ backgroundColor: '#1A3D8F', color: '#FFFFFF' }}
              className="btn"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;