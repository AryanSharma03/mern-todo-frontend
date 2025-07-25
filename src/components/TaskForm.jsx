// src/components/TaskForm.jsx
import React, { useState } from 'react'; // Import useState
import axios from 'axios'; // Import axios

// TaskForm now receives 'onAddTask' function as a prop from its parent (App.jsx)
const TaskForm = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState(''); // State to hold the input field's value
  const [error, setError] = useState(null); // State to hold form submission errors

  // Handles changes in the input field (controlled component)
  const handleInputChange = (e) => {
    setTaskText(e.target.value); // Update state as user types
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser page reload on form submit

    // Basic validation
    if (taskText.trim() === '') {
      setError('Task text cannot be empty.');
      return;
    }

    try {
      // Get the JWT token from local storage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Not authenticated. Please log in.');
        return;
      }

      // Make a POST request to your backend API to create a new task
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks`,
        { text: taskText }, // Data to send in the request body
        {
          headers: {
            Authorization: `Bearer ${token}` // Send the JWT token
          }
        }
      );

      // If successful, call the onAddTask function passed from App.jsx
      // This updates the tasks state in the parent component
      onAddTask(response.data);

      setTaskText(''); // Clear the input field after successful submission
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired or not authorized. Please log in again.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}> {/* Attach onSubmit handler to the form */}
        <input
          type="text"
          placeholder="Enter task..."
          value={taskText} // Input value is controlled by taskText state
          onChange={handleInputChange} // Update state on input change
          style={{ padding: '10px', width: 'calc(100% - 22px)', marginBottom: '10px' }}
        />
        <button
          type="submit" // Type submit makes button trigger form onSubmit
          style={{ padding: '10px 20px', backgroundColor: '#61dafb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>} {/* Display error message */}
    </div>
  );
};

export default TaskForm;