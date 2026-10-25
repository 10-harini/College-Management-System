import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './MainPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [username, setUsername] = useState(''); // ✅ Store username for welcome message
  const iconRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.clear();
      navigate('/');
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="main-layout">
      {/* Top navbar */}
      <div className="navbar position-relative d-flex justify-content-center align-items-center">
        HOGWARTS UNIVERSITY

        {/* 👤 Icon */}
        <div className="icon-wrapper" ref={iconRef}>
          <FontAwesomeIcon
            icon={faUser}
            className="logout-icon"
            title="Logout"
            onClick={() => setShowLogout(!showLogout)}
          />
          {showLogout && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Hamburger menu */}
      <button className="hamburger" onClick={toggleSidebar}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Link className="sidebar-link" to="/main/dashboard">Dashboard</Link>
        <Link className="sidebar-link" to="/main/department">Department</Link>
        <Link className="sidebar-link" to="/main/students">Students</Link>
        <Link className="sidebar-link" to="/main/marksheet">Marksheet</Link>
        <Link className="sidebar-link" to="/main/deptform">Department-Subject</Link>

      </div>

      {/* Nested content */}
      <div className="main-content">
        {username && (
          <div className="typewriter-container">
            <h2 className="typewriter">
              Welcome {username} to Hogwarts University
            </h2>
          </div>
        )}




        <Outlet />
      </div>

      {/* Footer */}
      <footer className="main-footer">
        © 2025 Hogwarts University | All Rights Reserved
      </footer>
    </div>
  );
};

export default MainPage;
