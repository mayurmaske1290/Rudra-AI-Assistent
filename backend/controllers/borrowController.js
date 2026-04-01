const Borrow = require('../models/Borrow');
const Return = require('../models/Return');
const Book = require('../models/Book');
const Student = require('../models/Student');
const sendEmail = require('../utils/sendEmail');

exports.borrowBook = async (req, res) => {
  const { student_id, book_id } = req.body;
  const student = await Student.findOne({ student_id });
  const book = await Book.findOne({ book_id });
  if (!student || !book) return res.status(404).json({ message: 'Student or Book not found' });
  if (book.available_copies < 1) return res.status(400).json({ message: 'No copies available' });

  const activeCount = await Borrow.countDocuments({ student_id, status: 'borrowed' });
  if (activeCount >= 5) return res.status(400).json({ message: 'Student borrow limit reached (5)' });

  const borrow_date = new Date();
  const due_date = new Date(borrow_date);
  due_date.setDate(due_date.getDate() + 30);

  const record = await Borrow.create({ student_id, book_id, borrow_date, due_date });
  book.available_copies -= 1;
  await book.save();

  return res.status(201).json(record);
};

exports.returnBook = async (req, res) => {
  const { student_id, book_id } = req.body;
  const borrow = await Borrow.findOne({ student_id, book_id, status: 'borrowed' }).sort({ borrow_date: 1 });
  if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

  borrow.status = 'returned';
  await borrow.save();

  const return_date = new Date();
  const overdueDays = Math.max(0, Math.ceil((return_date - borrow.due_date) / (1000 * 60 * 60 * 24)));
  const late_fee = overdueDays * 2;

  const ret = await Return.create({ student_id, book_id, return_date, late_fee });

  const book = await Book.findOne({ book_id });
  if (book) {
    book.available_copies += 1;
    await book.save();
  }

  return res.json(ret);
};

exports.getOverdue = async (req, res) => {
  const now = new Date();
  const overdues = await Borrow.find({ status: 'borrowed', due_date: { $lt: now } });
  return res.json(overdues);
};

exports.sendDueNotifications = async (req, res) => {
  const upcoming = new Date();
  upcoming.setDate(upcoming.getDate() + 2);
  const records = await Borrow.find({ status: 'borrowed', due_date: { $lte: upcoming } });

  for (const record of records) {
    const student = await Student.findOne({ student_id: record.student_id });
    if (student?.email) {
      await sendEmail({
        to: student.email,
        subject: 'Library due date reminder',
        text: `Book ${record.book_id} is due on ${record.due_date.toDateString()}`
      });
    }
  }

  return res.json({ message: `Processed ${records.length} reminders` });
};
