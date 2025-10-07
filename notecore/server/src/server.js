// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting server...');
console.log('FRONTEND_URL =', process.env.FRONTEND_URL);

// ------------------ CORS ------------------
// This must come BEFORE routes
app.use((req, res, next) => {
  console.log('🔹 Incoming request:', req.method, req.url);
  next();
});

const corsOptions = {
  origin: process.env.FRONTEND_URL, // exact frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
  credentials: true
};

app.use(cors(corsOptions));

// Log every OPTIONS preflight request
app.options('*', (req, res) => {
  console.log('🟢 Preflight OPTIONS request received for:', req.path);
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204); // No content
});

// ------------------ Body parser ------------------
app.use(express.json());

// ------------------ User ID middleware ------------------
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) {
    req.userId = parseInt(userId);
    console.log('🔹 User ID attached:', req.userId);
  }
  next();
});

// ------------------ Auth routes ------------------
app.post('/auth/login', async (req, res) => {
  console.log('🔹 /auth/login called with body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('⚠️ Missing email or password');
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user || user.password !== password) {
      console.log('⚠️ Invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('✅ Login success:', user.username);
    res.json({ userId: user.id, username: user.username });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  console.log('🔹 /auth/register called with body:', req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log('⚠️ Missing registration fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username',
      [username, email, password]
    );
    console.log('✅ Registration success:', result.rows[0].username);
    res.json({ userId: result.rows[0].id, username: result.rows[0].username });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ------------------ Notes routes ------------------
app.use('/notes', notesRouter);

// ------------------ Health check ------------------
app.get('/', (req, res) => {
  console.log('🔹 Health check called');
  res.send('✅ Notecore backend is running.');
});

// ------------------ Start server ------------------
const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ DB connected successfully!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 FRONTEND_URL = ${process.env.FRONTEND_URL}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();
