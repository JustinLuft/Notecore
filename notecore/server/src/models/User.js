const pool = require('../db');

const User = {
  async findByUsername(username) {
    const res = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    return res.rows[0];
  }
};

module.exports = User;
