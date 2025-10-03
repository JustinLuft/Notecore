const pool = require('../db');

const Note = {
  async getAll() {
    const res = await pool.query('SELECT * FROM notes ORDER BY updated_at DESC');
    return res.rows;
  },

  async create(title, content) {
    const res = await pool.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    return res.rows[0];
  },

  async update(id, title, content) {
    const res = await pool.query(
      'UPDATE notes SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 RETURNING *',
      [title, content, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM notes WHERE id=$1', [id]);
  }
};

module.exports = Note;
