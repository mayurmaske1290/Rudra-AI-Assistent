const Book = require('../models/Book');
const Student = require('../models/Student');
const Borrow = require('../models/Borrow');
const Return = require('../models/Return');

exports.getStats = async (req, res) => {
  const now = new Date();
  const [total_books, total_students, borrowed_books, returned_books, overdue_books] = await Promise.all([
    Book.countDocuments(),
    Student.countDocuments(),
    Borrow.countDocuments({ status: 'borrowed' }),
    Return.countDocuments(),
    Borrow.countDocuments({ status: 'borrowed', due_date: { $lt: now } })
  ]);

  res.json({ total_books, total_students, borrowed_books, returned_books, overdue_books });
};
