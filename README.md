# React Auth Dashboard

A full-stack authentication dashboard built with React (Vite) on the frontend and Node.js + Express on the backend.

It includes JWT-based authentication, protected routes, a user profile, and a task manager with CRUD operations and search.

## Features

- User Registration & Login (JWT Auth)
- Protected Routes
- User Profile (shows logged-in email)
- Task Management (Add, Delete, Toggle Complete)
- Search & Filter Tasks
- Clean Bootstrap UI
- Separate Frontend & Backend structure

## Tech Stack

Frontend:

- React (Vite)
- React Router
- Bootstrap

Backend:

- Node.js
- Express
- JWT
- bcryptjs

## Setup Instructions

Backend:

1. Open terminal in `backend` folder
2. Run: npm install
   node index.js

Frontend:

1. Open terminal in `frontend-assignment` folder
2. Run:
   npm install
   node index.js

Frontend runs on: http://localhost:5173  
Backend runs on: http://localhost:5000

## API Endpoints

- POST /register
- POST /login
- GET /profile (Protected)
- GET /tasks (Protected)
- POST /tasks (Protected)
- PATCH /tasks/:id (Protected)
- DELETE /tasks/:id (Protected)

## Author

Anubhav Sharma
