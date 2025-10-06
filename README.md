NOTECORE - A Themed Note Taking App

Project Structure:

notecore/
  backend/
    db.js                  - PostgreSQL connection
    server.js              - Express server
    routes/
      notes.js             - Notes routes
      auth.js              - Auth routes
    controllers/
      notesController.js
      authController.js
  frontend/
    src/
      pages/
        Dashboard.jsx
        Login.jsx
      components/
      App.jsx
    vite.config.js
    package.json
  .env
  README.txt

Tech Stack:

- Frontend: React, Tailwind CSS, Lucide-React icons, jsPDF
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Middleware: CORS, JSON parsing, custom auth middleware

Features:

- User authentication (login/register)
- Personal notes per user
- Create, update, delete notes
- Editable file names
- Save status indicator (SYNCED / UNSAVED / UPLOADING...)
- Export notes as PDF
- Cyberpunk aesthetic UI
- Persistent storage with PostgreSQL
- Fully responsive

Setup Instructions:

1. Backend:

  cd backend
  npm install

  Create .env:
    PORT=5000
    DATABASE_URL=postgresql://username:password@localhost:5432/notecore

  Start server:
    npm start

  Backend runs on http://localhost:5000

2. Frontend:

  cd frontend
  npm install

  Create .env:
    VITE_API_URL=http://localhost:5000

  Start frontend:
    npm run dev

  Frontend runs on http://localhost:5173

Database Schema:

Users table:
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
  );

Notes table:
  CREATE TABLE notes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

Usage:

- Open frontend in browser (http://localhost:5173)
- Register or login
- Create, edit, delete notes
- Export notes as PDF
- Notes are private per user

Notes Ownership & Security:

- Each note is linked to a user_id
- Backend checks req.userId for all CRUD operations
- Unauthorized access returns 401

Future Improvements:

- Password hashing & JWT authentication
- Real-time collaborative editing
- Dark/light theme toggle
- Note search and tagging
- File versioning

Author:

Justin - NoteCore
