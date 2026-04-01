const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    book_id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    publisher: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    available_copies: { type: Number, required: true, min: 0 },
    cover_image: { type: String, default: '' },
    qr_code: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
