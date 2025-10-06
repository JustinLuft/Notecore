// src/routes/notes.js
const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

// GET /notes
router.get('/', notesController.getAll);

// POST /notes
router.post('/', notesController.create);

// PUT /notes/:id
router.put('/:id', notesController.update);

// DELETE /notes/:id
router.delete('/:id', notesController.delete);

module.exports = router;
