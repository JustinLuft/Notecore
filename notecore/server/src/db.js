const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING, // match your .env
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('DB connected successfully!'))
  .catch(err => console.error('DB connection failed:', err));

module.exports = pool;
