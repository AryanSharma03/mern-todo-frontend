import React, { useState, useEffect } from 'react'; // Core React imports for hooks
import axios from 'axios'; // For making HTTP requests to the backend
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // React Router for navigation

// Component Imports:
// IMPORTANT: Make absolutely sure your component files are named exactly as imported here.
// For example, if your file is 'Headers.jsx', you'll need to change 'Header' to 'Headers' below.
import Headers from './components/Headers'; // Assuming your file is Header.jsx
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

// Page Imports:
// IMPORTANT: Make absolutely sure your page files are named exactly as imported here.
import Register from './pages/Register';
import Login from './pages/Login';


// IMPORTANT: Make sure AuthContext.jsx exists in src/context/
// And that AuthProvider and useAuth are correctly exported from it.
import { useAuth } from './context/AuthContext'; // Import our custom useAuth hook

function App() {
  // --- State Variables ---
  // These states are managed locally in App.jsx or derived from AuthContext
  const [tasks, setTasks] = useState([]); // Stores the list of tasks fetched from the backend
  const [loadingTasks, setLoadingTasks] = useState(true); // Specific loading state for tasks data
  const [error, setError] = useState(null); // Stores any global error messages to display

  // Get authentication state and functions from AuthContext
  // 'authLoading' is the loading state from AuthContext, indicating if the initial auth check is complete.
  const { isAuthenticated, loading: authLoading, setIsAuthenticated, user } = useAuth();

  // --- Effect for Fetching Tasks ---
  // This effect runs when 'isAuthenticated' or 'authLoading' changes.
  // It fetches tasks from the backend only if the user is authenticated and auth check is complete.
  useEffect(() => {
    const fetchTasks = async () => {
      // If not authenticated or still checking auth status, don't try to fetch protected tasks.
      if (!isAuthenticated) {
        setLoadingTasks(false); // Stop task loading if not authenticated
        return;
      }

      try {
        // Axios interceptor (set up in AuthContext) will automatically add the token,
        // so no need to pass 'headers' here!
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks`);
        setTasks(response.data); // Update tasks state with fetched data
        setError(null); // Clear any previous errors
        setLoadingTasks(false); // Task fetching is complete
      } catch (err) {
        console.error('Error fetching tasks in App.jsx:', err); // Log the detailed error
        setError('Failed to fetch tasks. Please ensure backend is running and you are logged in.');
        setLoadingTasks(false); // Task fetching is complete even on error
        
        // The 401 Unauthorized error is primarily handled by the Axios response interceptor in AuthContext.
        // It will trigger a logout, which then updates isAuthenticated, causing a re-render and redirect.
        // So, less specific 401 handling is needed here unless for different error messages.
      }
    };

    // Only attempt to fetch tasks if the initial authentication check from context is done.
    if (!authLoading) {
      fetchTasks();
    }
  }, [isAuthenticated, authLoading]); // Dependency array: Effect re-runs when these states change

  // --- Functions for Task Management (passed as props to TaskForm and TaskList) ---

  // Function to add a new task
  const addTask = (newTask) => {
    // Immutably update the tasks state by adding the new task to the end of the array
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Function to update an existing task
  const updateTask = async (taskId, updatedData) => {
    try {
      // Axios interceptor will automatically add the token
      const response = await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${taskId}`, updatedData);
      
      // Immutably update tasks state: replace the old task with the new updated one
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? response.data : task // If ID matches, use the updated data from backend
        )
      );
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error updating task:', err); // Log the detailed error
      setError('Failed to update task. Please try again!');
      // 401 error is handled by interceptor in AuthContext
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      // Axios interceptor will automatically add the token
      await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${taskId}`);
      
      // Immutably update tasks state: filter out the deleted task
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err); // Log the detailed error
      setError('Failed to delete task. Please try again.');
      // 401 error is handled by interceptor in AuthContext
    }
  };

  // --- Helper Component for Main Application Content ---
  // This component groups the Header, TaskForm, and TaskList for cleaner routing management.
  const MainAppContent = () => {
    // Display loading for tasks specifically
    if (loadingTasks) {
      return <div className="App" style={{ textAlign: 'center', padding: '20px' }}>Loading tasks...</div>;
    }
    // Display error specific to tasks fetching if any
    if (error) {
        return <div className="App" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</div>;
    }

    return (
      <div className="App">
        {/* IMPORTANT: Ensure this matches your Header component's import name */}
        <Headers />
        <TaskForm onAddTask={addTask} />
        <TaskList tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
      </div>
    );
  };

  // --- Conditional Rendering for Overall App Loading/Authentication Check ---
  // Display a loading message while the app is performing its initial authentication check via AuthContext.
  if (authLoading) {
    return <div className="App" style={{ textAlign: 'center', padding: '20px' }}>Checking authentication...</div>;
  }

  // --- Main Application Return with React Router Setup ---
  // The Router component wraps the entire application to enable client-side routing.
  return (
    <Router>
      <Routes> {/* Routes component defines all individual route mappings */}
        {/* Route for the registration page */}
        <Route path="/register" element={
          // If authenticated, redirect to /tasks; otherwise, render the Register component
          isAuthenticated ? <Navigate to="/tasks" /> : <Register />
        } />

        {/* Route for the login page */}
        <Route path="/login" element={
          // If authenticated, redirect to /tasks; otherwise, render the Login component.
          // CRUCIAL: The Login component will now use 'useAuth()' directly to call 'login()' from context.
          isAuthenticated ? <Navigate to="/tasks" /> : <Login />
        } />

        {/* Main tasks application route */}
        <Route path="/tasks" element={
          // Protect this route: If authenticated, render MainAppContent; otherwise, redirect to /login
          isAuthenticated ? <MainAppContent /> : <Navigate to="/login" />
        } />

        {/* Default route (root path '/') */}
        <Route path="/" element={
          // Redirect the root path: If authenticated, go to /tasks; otherwise, go to /login
          isAuthenticated ? <Navigate to="/tasks" /> : <Navigate to="/login" />
        } />
      </Routes>
      {/* Display global error message if any (not handled by interceptors or specific component) */}
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}
    </Router>
  );
}

export default App;
