const express = require('express');
const ctrl = require('../controllers/reportController');
const router = express.Router();
router.get('/borrow-history', ctrl.borrowHistory);
router.get('/student-history', ctrl.studentHistory);
router.get('/book-availability', ctrl.bookAvailability);
router.get('/borrow-history/pdf', ctrl.exportBorrowPdf);
module.exports = router;
