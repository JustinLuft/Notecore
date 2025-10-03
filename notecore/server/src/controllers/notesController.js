const Note = require('../models/Note');

const notesController = {
  async getAll(req, res) {
    try {
      const notes = await Note.getAll();
      res.json(notes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { title, content } = req.body;
      const note = await Note.create(title, content);
      res.json(note);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const note = await Note.update(id, title, content);
      res.json(note);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await Note.delete(id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = notesController;
