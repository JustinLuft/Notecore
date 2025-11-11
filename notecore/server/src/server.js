require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const notesRouter = require('./routes/notes');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting server...');
console.log('FRONTEND_URL =', process.env.FRONTEND_URL);

// ------------------ CORS Configuration ------------------
const allowedOrigins = [
  process.env.FRONTEND_URL, // main frontend
  'https://notecore.vercel.app', // explicit fallback
  'https://notecore-a4hnr23zr-justinlufts-projects.vercel.app', // preview
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔹 Incoming request Origin:', origin);
    
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      console.log('✅ No origin - allowing request');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }
    
    // Check if origin is a Vercel preview URL
    if (origin.includes('vercel.app')) {
      console.log('✅ Vercel preview URL allowed:', origin);
      return callback(null, true);
    }
    
    console.log('⚠️ CORS blocked for origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600, // Cache preflight for 10 minutes
  optionsSuccessStatus: 204
};

// ------------------ Apply CORS middleware FIRST ------------------
app.use(cors(corsOptions));

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
  console.log('📨 Login attempt:', { email: req.body.email, origin: req.headers.origin });
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Login successful for user:', user.id);
    res.json({ userId: user.id, username: user.username });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  console.log('📨 Register attempt:', { username: req.body.username, email: req.body.email });
  
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username',
      [username, email, password]
    );
    
    console.log('✅ Registration successful for user:', result.rows[0].id);
    res.json({ userId: result.rows[0].id, username: result.rows[0].username });
  } catch (err) {
    console.error('❌ Registration error:', err);
    
    // Check for duplicate email
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ------------------ Notes routes ------------------
app.use('/notes', notesRouter);

// ------------------ Health check ------------------
app.get('/', (req, res) => {
  res.json({ 
    status: '✅ Notecore backend is running',
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// ------------------ 404 handler ------------------
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});

// ------------------ Error handler ------------------
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ------------------ Start server ------------------
const startServer = async () => {
  try {
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT 1');
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Allowed origins:`, allowedOrigins);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
