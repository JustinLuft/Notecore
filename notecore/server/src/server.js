// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const notesRouter = require('./routes/notes');

const app = express();

// Render will assign a dynamic PORT
const PORT = process.env.PORT || 5000;

// --- CORS ---
// Allow your frontend to access backend
app.use(cors({
  origin: process.env.FRONTEND_URL, // your deployed frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// --- Attach userId from header ---
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) req.userId = parseInt(userId);
  next();
});

// --- AUTH ROUTES ---
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];

    if (!user || user.password !== password)
      return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ userId: user.id, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username',
      [username, email, password]
    );
    res.json({ userId: result.rows[0].id, username: result.rows[0].username });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// --- NOTES ROUTES ---
app.use('/notes', notesRouter);

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('✅ Notecore backend is running.');
});

// --- START SERVER ---
const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ DB connected successfully!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Frontend URL allowed: ${process.env.FRONTEND_URL}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();
