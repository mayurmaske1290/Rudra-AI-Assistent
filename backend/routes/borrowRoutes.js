const express = require('express');
const ctrl = require('../controllers/borrowController');
const router = express.Router();

router.post('/borrow', ctrl.borrowBook);
router.post('/return', ctrl.returnBook);
router.get('/overdue', ctrl.getOverdue);
router.post('/notify-due', ctrl.sendDueNotifications);

module.exports = router;
