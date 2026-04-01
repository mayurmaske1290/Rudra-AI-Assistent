const express = require('express');
const ctrl = require('../controllers/publisherController');
const router = express.Router();
router.get('/', ctrl.getPublishers);
router.post('/', ctrl.createPublisher);
router.put('/:id', ctrl.updatePublisher);
router.delete('/:id', ctrl.deletePublisher);
module.exports = router;
