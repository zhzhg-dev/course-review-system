const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },

  status: {
    type: String,
    default: 'In Progress'
  },

  source: {
    type: String,
    default: 'Student added'
  },

  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// One user should only add the same course once.
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
