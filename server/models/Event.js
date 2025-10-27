const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true }, // keep as YYYY-MM-DD for compatibility with frontend
  time: { type: String },
  venue: { type: String },
  poster: { type: String },
  photos: [{ type: String }],
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);