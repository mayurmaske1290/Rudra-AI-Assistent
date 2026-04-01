const { validationResult } = require('express-validator');
const QRCode = require('qrcode');
const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const qr_code = await QRCode.toDataURL(req.body.book_id);
  const book = await Book.create({ ...req.body, qr_code });
  return res.status(201).json(book);
};

exports.getBooks = async (req, res) => {
  const { search = '', page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', category } = req.query;
  const query = {
    ...(category ? { category } : {}),
    ...(search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
          ]
        }
      : {})
  };

  const books = await Book.find(query)
    .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  const total = await Book.countDocuments(query);

  return res.json({ data: books, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

exports.updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.json(book);
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.json({ message: 'Book deleted' });
};
