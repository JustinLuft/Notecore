// src/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ userId: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

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

module.exports = router;
