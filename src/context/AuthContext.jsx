// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // We'll set up global axios instance for interceptors

// 1. Create the Auth Context
const AuthContext = createContext();

// 2. Create the Auth Provider Component
// This component will wrap our application and provide authentication state and functions to its children.
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // To store user details (e.g., username, ID)
    const [loading, setLoading] = useState(true); // For initial auth check loading

    // Effect to check authentication status on initial load (runs once)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, you'd send this token to your backend to verify validity
            // (e.g., to a /api/auth/verify endpoint)
            // For now, if a token exists, we assume authenticated until proven otherwise.
            setIsAuthenticated(true);
            // Optionally, decode basic user info from token (if you want to display username)
            try {
                const decoded = JSON.parse(atob(token.split('.')[1])); // Simple base64 decode for payload
                setUser({ id: decoded.id, username: decoded.username || 'User' }); // Token might just have ID
            } catch (e) {
                console.error("Failed to decode token:", e);
                localStorage.removeItem('token'); // Clear bad token
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // --- Axios Interceptor Setup ---
    // This runs only once when the AuthProvider mounts.
    useEffect(() => {
        // Request Interceptor: Automatically add JWT to every outgoing request
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response Interceptor: Handle 401 Unauthorized errors globally
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // If we get a 401 Unauthorized response, it means our token is expired or invalid
                if (error.response && error.response.status === 401) {
                    console.log('401 Unauthorized caught by interceptor. Logging out...');
                    logout(); // Call logout function from context
                    // Optionally, redirect to login:
                    // window.location.href = '/login'; // Or use navigate if in a component context
                }
                return Promise.reject(error);
            }
        );

        // Cleanup function for useEffect: Remove interceptors when component unmounts
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []); // Empty dependency array means runs once on mount

    // --- Authentication Functions ---
    // This function will be called by the Login component on successful login
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(userData); // Set user details
    };

    // This function will be called to log out the user
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        // After logout, you might want to redirect the user to the login page
        // (handled by Navigate component in App.jsx routing)
    };

    // The value prop provides the state and functions to any component consuming this context
    const authContextValue = {
        isAuthenticated,
        user,
        loading, // Export loading state from context as well
        login,
        logout,
        setIsAuthenticated, // Useful if App.jsx needs to set it directly
        setUser // Useful if App.jsx needs to set user directly
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children} {/* Renders whatever components are wrapped by AuthProvider */}
        </AuthContext.Provider>
    );
};

// 3. Custom Hook to Consume the Context (optional but good practice)
// Makes it easier to use the context in components: just import useAuth()
export const useAuth = () => {
    return useContext(AuthContext);
};