const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, trim: true },
    book_id: { type: String, required: true, trim: true },
    borrow_date: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
    status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Borrow', borrowSchema);
