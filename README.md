# Notecore

A futuristic cyberpunk-style note-taking web application with real-time editing, PDF export, and per-user note storage. Built with **React** on the frontend and **Express + PostgreSQL** on the backend.

## Table of Contents

- Features
- Tech Stack
- Project Structure
- Setup Instructions
- Environment Variables
- Database Schema
- Usage
- Folder Permissions & Notes Ownership
- Future Improvements
- Author

## Features

- User authentication (login/register)
- Personal notes per user (other users cannot see your notes)
- Create, update, delete notes
- Editable file names
- Save status indicator (`SYNCED` / `UNSAVED` / `UPLOADING...`)
- Export notes as PDF
- Cyberpunk aesthetic UI with glitch animations
- Persistent storage with PostgreSQL
- Fully responsive

## Tech Stack

- Frontend: React, Tailwind CSS, Lucide-React icons, jsPDF
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Middleware: CORS, JSON parsing, custom auth middleware

## Project Structure
notecore/
├── backend/
│ ├── db.js # PostgreSQL connection
│ ├── server.js # Express server
│ ├── routes/
│ │ ├── notes.js # Notes routes
│ │ └── auth.js # Auth routes
│ └── controllers/
│ ├── notesController.js
│ └── authController.js
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ └── Login.jsx
│ │ ├── components/
│ │ └── App.jsx
│ ├── vite.config.js
│ └── package.json
├── .env
└── README.md




