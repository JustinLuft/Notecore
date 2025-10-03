const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.get('/', notesController.getAll);
router.post('/', notesController.create);
router.put('/:id', notesController.update);
router.delete('/:id', notesController.delete);

module.exports = router;
