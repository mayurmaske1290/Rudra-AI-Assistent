const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/bookController');

const router = express.Router();
router.get('/', ctrl.getBooks);
router.post('/', [body('book_id').notEmpty(), body('title').notEmpty(), body('author').notEmpty(), body('price').isNumeric(), body('category').notEmpty(), body('available_copies').isInt({ min: 0 })], ctrl.createBook);
router.put('/:id', ctrl.updateBook);
router.delete('/:id', ctrl.deleteBook);
module.exports = router;
