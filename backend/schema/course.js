const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  initials: { type: String, default: '' },
  name: { type: String, required: true },
  term: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  professor: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  credits: { type: String, required: true },
  rating: { type: String, default: '0.0' },
  reviews: { type: String, default: '0' },
  semester: { type: String, required: true },
  description: { type: String, required: true },
  reviewList: [reviewSchema]
});

module.exports = mongoose.model('Course', courseSchema);

