// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: '#282c34', padding: '20px', color: 'white', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Main App Title/Link */}
      <Link to={isAuthenticated ? "/tasks" : "/"} style={{ color: 'white', textDecoration: 'none' }}>
        <h1>My To-Do List</h1>
      </Link>

      <nav> {/* Navigation links container */}
        {isAuthenticated ? (
          // If authenticated, show welcome message and Logout button
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>Welcome, {user ? user.username : 'User'}!</span> {/* Use user.username if available */}
            <button
              onClick={handleLogout}
              style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        ) : (
          // If not authenticated, show Register and Login links
          <div>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>
              Register
            </Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;