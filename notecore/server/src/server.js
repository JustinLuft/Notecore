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
const allowedOrigins = [
  process.env.FRONTEND_URL, // main frontend
  'https://notecore-a4hnr23zr-justinlufts-projects.vercel.app', // preview
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔹 Incoming request Origin:', origin);
    if (!origin) return callback(null, true); // allow Postman / curl

    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      callback(null, origin); // must return exact origin for credentials
    } else {
      console.log('⚠️ CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
};

// ------------------ Apply CORS ------------------
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests **for all routes**
app.options('*', cors(corsOptions));

// ------------------ Body parser ------------------
app.use(express.json());

// ------------------ User ID middleware ------------------
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) req.userId = parseInt(userId);
  next();
});

// ------------------ Auth routes ------------------
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ userId: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username',
      [username, email, password]
    );
    res.json({ userId: result.rows[0].id, username: result.rows[0].username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ------------------ Notes routes ------------------
app.use('/notes', notesRouter);

// ------------------ Health check ------------------
app.get('/', (req, res) => res.send('✅ Notecore backend is running.'));

// ------------------ Start server ------------------
const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

startServer();
