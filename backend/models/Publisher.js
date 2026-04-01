const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema(
  {
    publisher_id: { type: String, required: true, unique: true, trim: true },
    publisher_name: { type: String, required: true, trim: true },
    publisher_address: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Publisher', publisherSchema);
