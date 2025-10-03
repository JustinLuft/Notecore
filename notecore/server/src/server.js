const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ADD THIS: Log all incoming requests
app.use((req, res, next) => {
  console.log(`==================`);
  console.log(`Incoming request: ${req.method} ${req.path}`);
  console.log(`Full URL: ${req.originalUrl}`);
  console.log(`==================`);
  next();
});

// Database connection (optional fallback if unreachable)
let pool;
try {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    family: 4
  });

  pool.connect()
    .then(() => console.log('DB connected successfully!'))
    .catch(err => console.warn('DB connection warning (continuing anyway):', err));

} catch (err) {
  console.warn('DB setup failed, continuing without DB:', err);
}

app.locals.db = pool;

// --- Routes (order matters!) ---
app.get('/', (req, res) => {
  console.log('ROOT ROUTE HIT');
  res.send('Backend is running!');
});

app.get('/test', (req, res) => {
  console.log('TEST ROUTE HIT!!!');
  res.json({ message: 'Test route is working!' });
});

app.use('/notes', notesRoutes);
app.use('/auth', authRoutes);

// --- Start server ---
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Try accessing: http://localhost:${port}/test`);
});