// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../context/AuthContext';

const Login = ({ onLoginSuccess }) => { // onLoginSuccess is no longer passed as a prop, but useAuth is used directly
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Get login function and isAuthenticated from context

  // If already authenticated, redirect to tasks immediately (handles cases where token is still valid on this component mount)
  if (isAuthenticated) {
    navigate('/tasks');
    return null; // Don't render the form if already authenticated and redirecting
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      login(response.data.token, response.data.user); // Call the login function from AuthContext

      setMessage(response.data.message + '. Redirecting to tasks...');
      setUsername('');
      setPassword('');
      // No setTimeout needed here for navigation. Context update should trigger App.jsx re-render.
      // navigate('/tasks'); // Can directly navigate. The context update in App.jsx will confirm.
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 12px rgba(0,0,0,0.1)' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Login
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', color: message.includes('failed') || message.includes('Invalid') ? 'red' : 'green' }}>{message}</p>}

      {/* NEW: Link to Register page */}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;