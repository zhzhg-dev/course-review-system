const mongoose = require('mongoose');

const courseReviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  replierId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },

  initials: {
    type: String,
    default: 'U',
    trim: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  term: {
    type: String,
    required: true,
    trim: true
  },

  text: {
    type: String,
    required: true,
    trim: true
  },

  helpful: {
    type: Number,
    default: 0
  },

  helpfulBy: {
    type: [String],
    default: []
    },
  seedKey: {
    type: String,
    unique: true,
    sparse: true
    }
}, {
  timestamps: true
});

module.exports = mongoose.model('CourseReview', courseReviewSchema);
