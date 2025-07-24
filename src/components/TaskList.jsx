// src/components/TaskList.jsx
import React from 'react';

// TaskList now receives tasks, onUpdateTask, and onDeleteTask as props
const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => { 
  // Function to toggle task completion status
  const handleToggleComplete = (task) => {
    // Calls the onUpdateTask function passed from App.jsx
    // Sends the task's ID and the new (toggled) completed status
    onUpdateTask(task._id, { completed: !task.completed });
  };

  // Function to handle task deletion
  const handleDelete = (taskId) => {
    // Calls the onDeleteTask function passed from App.jsx
    onDeleteTask(taskId);
  };

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>No tasks found. Add a new one!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li key={task._id} style={{ padding: '10px', borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
              <div>
                {/* Add onClick handler to the Complete/Undo button */}
                <button
                  onClick={() => handleToggleComplete(task)} // <--- UPDATED THIS LINE
                  style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                {/* Add onClick handler to the Delete button */}
                <button
                  onClick={() => handleDelete(task._id)} // <--- UPDATED THIS LINE
                  style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;