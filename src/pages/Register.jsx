import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); // FIX: Changed setPasword to setPassword
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password,
            });
            setMessage(response.data.message + '. Redirecting to login...');
            // On successful registration, clear form and redirect to login page after a delay
            setUsername('');
            setPassword(''); // FIX: Changed setPasword to setPassword
            
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 2000); // Redirect after 2 seconds
        } catch (err) {
            console.error('Registration error:', err.response?.data?.message || err.message);
            setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 12px rgba(0,0,0,0.1)' }}>
            <h2>Register</h2>
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
                        onChange={(e) => setPassword(e.target.value)} // Correctly calls setPassword
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Register
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.includes('failed') || message.includes('exists') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
};

export default Register;