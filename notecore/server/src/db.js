const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // use DATABASE_URL
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('DB connected successfully!'))
  .catch(err => console.error('DB connection failed:', err));

module.exports = pool;
