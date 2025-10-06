// src/controllers/notesController.js
const pool = require('../db');

exports.getAll = async (req, res) => {
  const userId = req.userId; // comes from middleware
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      'SELECT * FROM notes WHERE user_id=$1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

exports.create = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      'UPDATE notes SET title=$1, content=$2 WHERE id=$3 AND user_id=$4 RETURNING *',
      [title, content, id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await pool.query(
      'DELETE FROM notes WHERE id=$1 AND user_id=$2',
      [id, userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
