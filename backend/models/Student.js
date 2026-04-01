const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
