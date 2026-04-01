const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const { generatePdfBuffer } = require('../utils/reportGenerator');

exports.borrowHistory = async (req, res) => {
  const rows = await Borrow.find().sort({ createdAt: -1 }).lean();
  res.json(rows);
};

exports.studentHistory = async (req, res) => {
  const { student_id } = req.query;
  const rows = await Borrow.find(student_id ? { student_id } : {}).sort({ createdAt: -1 }).lean();
  res.json(rows);
};

exports.bookAvailability = async (req, res) => {
  const rows = await Book.find({}, { book_id: 1, title: 1, available_copies: 1, _id: 0 }).lean();
  res.json(rows);
};

exports.exportBorrowPdf = async (req, res) => {
  const rows = await Borrow.find().sort({ createdAt: -1 }).lean();
  const pdf = await generatePdfBuffer('Borrow History Report', rows);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=borrow-history.pdf');
  res.send(pdf);
};
