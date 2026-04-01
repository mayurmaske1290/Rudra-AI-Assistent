const express = require('express');
const ctrl = require('../controllers/studentController');
const router = express.Router();
router.get('/', ctrl.getStudents);
router.post('/', ctrl.createStudent);
router.put('/:id', ctrl.updateStudent);
router.delete('/:id', ctrl.deleteStudent);
module.exports = router;
