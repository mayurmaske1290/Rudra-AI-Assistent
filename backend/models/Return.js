const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, trim: true },
    book_id: { type: String, required: true, trim: true },
    return_date: { type: Date, default: Date.now },
    late_fee: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Return', returnSchema);
