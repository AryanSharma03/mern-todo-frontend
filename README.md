# MERN Stack To-Do Application

A full-stack web application for managing your daily tasks, built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. This application features secure user authentication and personalized task management.

## Live Demo

* **Frontend (Vercel):** [https://mern-todo-frontend-gamma.vercel.app/](https://mern-todo-frontend-gamma.vercel.app/)
* **Backend API (Render):** [https://aryan-mern-todo-backend.onrender.com/](https://aryan-mern-todo-backend.onrender.com/)

## Features

* **User Authentication:** Secure registration and login with JWT (JSON Web Tokens) and password hashing (bcryptjs).
* **Personalized Tasks:** Users can create, view, update, and delete only their own tasks.
* **CRUD Operations:** Full Create, Read, Update, Delete functionality for To-Do items.
* **Global State Management:** Utilizes React Context API for managing authentication state across the application.
* **Automated API Calls:** Axios Interceptors automatically attach JWTs to authenticated requests and handle token expiration.
* **Responsive Design:** (Optional: Add if you implemented any specific responsive CSS).
* **Error Handling:** Robust error handling for API calls and user authentication.

## Technologies Used

* **Frontend:**
    * React.js (with Vite)
    * React Router DOM
    * Axios
    * Context API
* **Backend:**
    * Node.js
    * Express.js
    * MongoDB (NoSQL Database)
    * Mongoose (ODM for MongoDB)
    * bcryptjs (for password hashing)
    * jsonwebtoken (for JWTs)
    * cors (for Cross-Origin Resource Sharing)
* **Deployment:**
    * Vercel (Frontend Hosting)
    * Render (Backend API Hosting)
    * GitHub (Version Control)

## Setup and Local Development

Follow these steps to set up and run the project locally.

### 1. Clone the Repositories

```bash
# Clone the backend
git clone https://github.com/AryanSharma03/mern-todo-backend
cd mern-todo-backend

# Clone the frontend (in a separate directory, NOT inside backend)
cd .. # Go back to mern-sde-projects
git clone https://github.com/AryanSharma03/mern-todo-frontend
cd mern-todo-frontend